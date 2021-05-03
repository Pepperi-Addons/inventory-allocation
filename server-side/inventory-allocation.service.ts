import { PapiClient, InstalledAddon, User } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';
import { OrderAllocation, ORDER_ALLOCATION_TABLE_NAME, UserAllocation, USER_ALLOCATION_TABLE_NAME, Warehouse, WAREHOUSE_TABLE_NAME, WAREHOUSE_LOCK_TABLE_SUFFIX } from './entities';
import { performance } from 'perf_hooks'
import { v4 as uuid } from 'uuid'
import { warehouses } from './inventory_allocation';

const MAXIMUM_LOCK_WAITING_TIME_IN_MS = 25000;
const LOCK_WAITING_ITERATION_TIME_IN_MS = 150;
const ORDER_TEMP_ALLOCATION_TIME_IN_MINUTES = 1;

/**
 * Sleep for ms milliseconds
 * @param ms number of milliseconds to sleep
 * @returns A promise that will be resolved at least after ms milliseconds have passed
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    })
}
/**
 * Check if a date falls between two dates
 * @param date the date to check
 * @param before the date before
 * @param after the date after
 * @returns true if before <= date <= after
 */
function between(date: Date, before: Date, after: Date) {
    return date >= before && date <= after;
}

export class InventoryAllocationService {

    papiClient: PapiClient;
    addonUUID: string;

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey
        });
        this.addonUUID = client.AddonUUID;
    }

    /**
     * Waits until the warehouse is locked for update
     * throws an exception if the warehouse can't be locked
     * @param warehouseID the warehouse UUID
     * 
     * @returns the key to unlock the warehouse
     */
    async waitOnLockWarehouse(warehouseID: string): Promise<string> {
        const key = uuid();

        const table = warehouseID + WAREHOUSE_LOCK_TABLE_SUFFIX;
        const adal = this.papiClient.addons.data.uuid(this.addonUUID).table(table);

        // create a warehouse lock object
        await adal.upsert({
            Key: key
        });

        try {
            // wait until you are the first in line
            // wait a maximum of 30
            let first = false;
            let waitingTime = 0;

            while (!first) {
                const l = await adal.find({
                    // page_size: 1, doesn't work - returns empty array
                    order_by: 'CreationDateTime' 
                });

                if (l.length === 0) {
                    throw new Error('Error locking the warehouse: The lock table returned an empty array.');
                }

                if (l[0].Key === key) {
                    first = true;
                }
                else {
                    
                    if (waitingTime >= MAXIMUM_LOCK_WAITING_TIME_IN_MS) {
                        throw new Error(`Timeout (${MAXIMUM_LOCK_WAITING_TIME_IN_MS}ms) waiting for lock with key: ${key}.`)
                    }

                    // you are not the first -- wait until you are
                    console.log(`Waiting for the lock to be free. Current lock: ${l[0].Key}`);
                    sleep(LOCK_WAITING_ITERATION_TIME_IN_MS);
                    waitingTime += LOCK_WAITING_ITERATION_TIME_IN_MS;
                }
            }
        }
        catch (err) {
            throw err;
        }
        finally {
            // remove the lock object
            await this.unlockWarehouse(warehouseID, key);
        }

        return key;
    }

    /**
     * Unlock the warehouse
     * @param key 
     * @param warehouseID 
     */
    async unlockWarehouse(key: string, warehouseID: string): Promise<void> {
        const table = warehouseID + WAREHOUSE_LOCK_TABLE_SUFFIX;
        const adal = this.papiClient.addons.data.uuid(this.addonUUID).table(table);

        await adal.upsert({
            Key: key,
            Hidden: true
        });
    }

    /**
     * Perform a block of code within the warehouse lock
     * @param warehouseID the warehouse id
     * @param block the code block to run
     */
    async performInLock(warehouseID: string, block: () => Promise<void>): Promise<void> {
        let key = '';
        try {
            const t0 = performance.now();
            key = await this.waitOnLockWarehouse(warehouseID);
            const t1 = performance.now();
            
            console.log(`Waiting on lock ${key} for warehouse ${warehouseID} took: ${(t1-t0).toFixed(2)}ms`);
    

            await block();
        }
        catch (err) {   
            // rethow to be handled by addon api
            throw err;
        }
        finally {
            if (key) {
                await this.unlockWarehouse(key, warehouseID);
            }
        }
    }

    /**
     * Updates the inventories for a warehouse
     * This is done under a warehouse lock
     * All the order & user remaining allocations (in this order) need to be subtracted from the new inventory
     * (This can result in reaching a negative inventory - user bug)
     * @param warehouseID the warehouse id
     * @param inventories the item inventories to update/rebase
     */
    async rebaseInventories(warehouseID: string, inventories: { [key: string]: number }) {
        const adal = this.papiClient.addons.data.uuid(this.addonUUID);

        // make sure that the warehouse exists, if not - create it
        await this.createWarehouseIfNeeded(warehouseID);

        // use later to update the UDT and for logging purposes
        const originalInventories = JSON.parse(JSON.stringify(inventories));

        await this.performInLock(warehouseID, async () => {
            const t0 = performance.now();

            // get the current warehouse object
            const warehouse = await adal.table(WAREHOUSE_TABLE_NAME).key(warehouseID).get() as Warehouse;

            // get all the orders
            const orderAllocations = (await adal.table(ORDER_ALLOCATION_TABLE_NAME).iter({
                where: `WarehouseID = '${warehouseID}'` // hopefully an index
            }).toArray()) as OrderAllocation[];

            // subtract the order allocations per item
            for (const alloc of orderAllocations) {
                for (const item in alloc.ItemAllocations) {
                    inventories[item] -= alloc.ItemAllocations[item];
                }

                if (alloc.TempAllocation) {
                    for (const item in alloc.TempAllocation.ItemAllocations) {
                        inventories[item] -= alloc.TempAllocation.ItemAllocations[item];
                    }
                }
            }

            // get all the user allocations
            const userAllocations = (await adal.table(USER_ALLOCATION_TABLE_NAME).iter({
                where: `WarehouseID = '${warehouseID}' AND Allocated = true`
            }).toArray()) as UserAllocation[];

            // subtract the user allocations
            for (const alloc of userAllocations) {
                if (alloc.Allocated) { // double check
                    inventories[alloc.ItemExternalID] -= alloc.RemainingAllocation;
                }
            }

            // update the warehouse
            warehouse.Inventory = inventories;
            await adal.table(WAREHOUSE_TABLE_NAME).upsert(warehouse);

            const t1 = performance.now();
            console.log(`rebase inventories took ${(t1-t0).toFixed(2)}ms with ${orderAllocations.length} order allocations and ${userAllocations.length} user allocations`)
        });
    }

    /**
     * Commit orders as they have already been supplied and do not need to be allocated anymore
     * All that needs to be done is hide the OrderAllocations 
     * This way when the new inventory arrives in rebaseInventories it will not be subtracted
     * @param warehouseID 
     * @param orders an array of orders to commit
     */
    async commitAllocations(warehouseID: string, orders: { OrderUUID: string }[]) {
        const adal = this.papiClient.addons.data.uuid(this.addonUUID);
        
        await this.performInLock(warehouseID, async () => {
            // need to optimize - bulk upsert
            for (const order of orders) {
                await adal.table(ORDER_ALLOCATION_TABLE_NAME).upsert({
                    Key: order.OrderUUID,
                    Hidden: true
                });
            }
        })
    }

    /**
     * Allocate item inventory for an order.
     * Takes into account user allocations and warehouse inventory.
     * This can also merge with an existing order allocation.
     * @param warehouseID the warehouse id
     * @param orderUUID the order id
     * @param userUUID the user id
     * @param items the items to allocate for the order
     * @returns 
     */
    async allocateOrderInventory(warehouseID: string, orderUUID: string, userUUID: string, items: { [key: string]: number }): Promise<{ Success: boolean, AllocationAvailability: { [key: string]: number } }> {
        const res = {
            Success: false,
            AllocationAvailability: {}
        }
        const adal = this.papiClient.addons.data.uuid(this.addonUUID);

        // first lock the warehouse
        await this.performInLock(warehouseID, async () => {

            let existing: OrderAllocation = {
                Key: orderUUID,
                OrderUUID: orderUUID,
                WarehouseID: warehouseID,
                UserUUID: userUUID,
                ItemAllocations: {},
                TempAllocation: undefined
            };
            
            // check if there already is an order
            try {
                existing = await adal.table(ORDER_ALLOCATION_TABLE_NAME).key(orderUUID).get() as OrderAllocation;

                // users can change
                // we always use the last one
                existing.UserUUID = userUUID;
            }
            catch(err) {
                // todo: make sure the error is not found the orderUUID
            }

            // bring the warehouse inventory
            const warehouse = await this.getWarehouse(warehouseID);

            // 1. Calculate the amount to allocated or deallocate per item
            const newAllocations = await this.calculateNewAllocations(existing, items);

            // 2. Check if the allocation will succeed aka be a real allocation (not temp)
            const res = await this.checkAllocationAvailability(warehouse, userUUID, newAllocations);

            // 3. Perform the allocation (update warehouse inventory & user allocation)
            await this.updateInventory(newAllocations, warehouseID, userUUID);

            // 4. Update the OrderAllocation object
            if (res.Success) {
                existing.TempAllocation = undefined;
                existing.ItemAllocations = items;
            }
            else {
                if (!existing.TempAllocation) {
                    existing.TempAllocation = {
                        Expires: '',
                        ItemAllocations: {}
                    }
                }

                // update the expiry date
                existing.TempAllocation.Expires = (new Date(new Date().getTime() + warehouse.TempAllocationTime*60*1000)).toISOString();

                // set the newAllocation in the TempAllocations
                for (const item in newAllocations) {
                    let quantity = newAllocations[item];
                    
                    // no temp allocation for this item yet, create it
                    if (existing.TempAllocation.ItemAllocations[item] === undefined) {
                        existing.TempAllocation.ItemAllocations[item] = 0;
                    }

                    // add quantity to temp allocation
                    existing.TempAllocation.ItemAllocations[item] += quantity;

                    // the quantity might be negative, in that case we might need to subtract from a real allocation
                    // after subtracting from the temp allocation
                    if (existing.TempAllocation.ItemAllocations[item] < 0) {
                        existing.ItemAllocations[item] += existing.TempAllocation.ItemAllocations[item];
                        existing.TempAllocation.ItemAllocations[item] = 0;
                    }
                }
            }

            // update the order allocation
            await adal.table(ORDER_ALLOCATION_TABLE_NAME).upsert(existing);
        });

        return res;
    }

    /**
     * Update the inventory in the warehouse and user allocation
     * The new allocations sent can be positive values (allocating inventory) or negative values (de-allocating values)
     * @param newAllocations the allocations to update. 
     * @param warehouse the warehouse object to udpate
     * @param userAllocation the user allocation to update
     */
    async updateInventory(allocations: {[key: string]: number}, warehouseID: string, userUUID: string) {
        const adal = this.papiClient.addons.data.uuid(this.addonUUID);
        const warehouse = await adal.table(WAREHOUSE_TABLE_NAME).key(warehouseID).get();
        let warehouseInventoryChanged = false;

        // update the inventory
        for (const item in allocations) {
            let quantity = allocations[item];
            const userAllocation = await this.getUserAllocation(warehouseID, userUUID, item);
            if (userAllocation && userAllocation.Allocated) {

                // used gets to total so that the user will not get any more allocation
                // can't be less than 0
                userAllocation.UsedAllocation += allocations[item];
                userAllocation.UsedAllocation = Math.max(0, userAllocation.UsedAllocation); 

                // calculate the amount to subtract from the users Remaining allocation
                let toSubtract = 0;
                if (quantity < 0) { 
                    // deallocation: upto max - used
                    // example:
                    // MaxAllocation: 20, UsedAllocation: 15, quantity: -8
                    // toSubtract = -5 (subtracting a negative number is adding)
                    toSubtract = Math.max(quantity, userAllocation.UsedAllocation - userAllocation.MaxAllocation);
                }
                else if (quantity > 0) { 
                    // allocation usage: upto remaining
                    toSubtract = Math.min(quantity, userAllocation.RemainingAllocation);
                }
                
                userAllocation.RemainingAllocation -= toSubtract;
                quantity -= toSubtract;

                if (toSubtract != 0) {
                    // update the user allocation
                    await adal.table(USER_ALLOCATION_TABLE_NAME).upsert(userAllocation);
                }
            }

            if (quantity != 0) {
                // if there still is quantities to add/subtract
                warehouseInventoryChanged = true;
                warehouse.Inventory[item] -= quantity;
            }
        }

        // update the warehouse
        if (warehouseInventoryChanged) {
            await adal.table(WAREHOUSE_TABLE_NAME).upsert(warehouse);
        }
    }

    /**
     * This is meant to run from a code job and reset and temporary allocations for orders and users
     * to deallocate them and put back into the user and/or warehouse inventory
     */
    async checkAllocations() {
        const t0 = performance.now();

        const adal = this.papiClient.addons.data.uuid(this.addonUUID);

        // get all warehouses
        const warehouses = await adal.table(WAREHOUSE_TABLE_NAME).iter({ fields: ['Key'] }).toArray();
        
        // make sure none of the locks are stuck
        for (const warehouse of warehouses) {
            const locks = await adal.table(warehouse.Key + WAREHOUSE_LOCK_TABLE_SUFFIX).iter({
            }).toArray();
            for (const lock of locks) {
                if (new Date(lock.CreationDateTime!) < new Date(new Date().getTime() - 60*1000)) {
                    console.log(`Removing lock with key: ${lock.Key}. Created: ${lock.CreationDateTime}`);
                    await adal.table(warehouse.Key + WAREHOUSE_LOCK_TABLE_SUFFIX).upsert({
                        Key: lock.Key,
                        Hidden: true
                    })
                }
            }
        }

        // get all the order allocation
        let orderAllocations = await adal.table(ORDER_ALLOCATION_TABLE_NAME).iter().toArray() as OrderAllocation[];

        // only order allocations with temp allocations that have expired
        orderAllocations = orderAllocations.filter(order => order.TempAllocation && new Date(order.TempAllocation.Expires) < new Date());

        for (const obj of orderAllocations) {
            await this.performInLock(obj.WarehouseID, async () => {
                // need to retrieve the order again b/c it might have changed b/c we were not in a lock
                const order = await adal.table(ORDER_ALLOCATION_TABLE_NAME).key(obj.Key).get() as OrderAllocation;

                // make sure that it is still expired
                if (order.TempAllocation && new Date(order.TempAllocation.Expires) < new Date()) {
                    // update all inventories to minues the amount reserved
                    const newAllocations = order.TempAllocation.ItemAllocations;
                    for (const item in newAllocations) {
                        newAllocations[item] = -newAllocations[item];
                    }

                    order.TempAllocation = null;

                    // update the inventories
                    await this.updateInventory(newAllocations, order.WarehouseID, order.UserUUID);

                    // update the order allocaiton
                    await adal.table(ORDER_ALLOCATION_TABLE_NAME).upsert(order);
                }
            });
        }

        // get all the user allocation
        let userAllocations = await adal.table(USER_ALLOCATION_TABLE_NAME).iter().toArray() as UserAllocation[];

        // filter out only users that have allocations that need changes
        // 1. they need allocation and haven't been allocated yet
        // 2. they have allocation and need to be deallocated
        // 3. they can get more allocation
        userAllocations = userAllocations.filter(userAllocation => {
            const validNow = between(new Date(), new Date(userAllocation.StartDateTime), new Date(userAllocation.EndDateTime));
            return validNow != userAllocation.Allocated || userAllocation.RemainingAllocation < (userAllocation.MaxAllocation - userAllocation.UsedAllocation);
        });

        for (const obj of userAllocations) {
            await this.performInLock(obj.WarehouseID, async () => {
                
                // get the user allocation again in the lock
                const userAllocation = await this.getUserAllocation(obj.WarehouseID, obj.UserUUID, obj.ItemExternalID);
                if (!userAllocation) {
                    throw new Error(`Could not find user allocation for key: ${obj.Key}`)
                }

                const warehouse = await adal.table(WAREHOUSE_TABLE_NAME).key(userAllocation.WarehouseID).get() as Warehouse;
                const validNow = between(new Date(), new Date(userAllocation.StartDateTime), new Date(userAllocation.EndDateTime));
                const item = userAllocation.ItemExternalID;

                if (validNow && !userAllocation.Allocated) {
                    // need to allocate
                    userAllocation.Allocated = true;
                    userAllocation.UsedAllocation = 0;
                    userAllocation.RemainingAllocation = Math.min(userAllocation.MaxAllocation, warehouse.Inventory[item] || 0);

                    // subtract from the warehouse
                    warehouse.Inventory[item] -= userAllocation.RemainingAllocation;
                }
                else if (!validNow && userAllocation.Allocated) {
                    // need to deallocate
                    userAllocation.Allocated = false;

                    // add back to the warehouse
                    warehouse.Inventory[userAllocation.ItemExternalID] += userAllocation.RemainingAllocation;
                }
                else if (userAllocation.Allocated) {
                    const missingAllocation =  userAllocation.MaxAllocation - userAllocation.RemainingAllocation - userAllocation.UsedAllocation;
                    if (missingAllocation > 0) {
                        const allocationToAdd = Math.max(missingAllocation, warehouse.Inventory[item] || 0);
                        warehouse.Inventory[item] -= allocationToAdd;
                        userAllocation.RemainingAllocation += allocationToAdd;
                    }   
                }

                // update the user & warehouse
                await adal.table(USER_ALLOCATION_TABLE_NAME).upsert(userAllocation);
                await adal.table(WAREHOUSE_TABLE_NAME).upsert(warehouse);
            });
        }

        const t1 = performance.now();
        console.log(`check allocations took: ${(t1-t0).toFixed(2)} with ${warehouses.length} warehouses, ${userAllocations.length} user allocations, ${orderAllocations.length} order allocations`)
    }

    async getWarehouse(warehouseID: string): Promise<Warehouse> {
        const adal = this.papiClient.addons.data.uuid(this.addonUUID);
        return await adal.table(WAREHOUSE_TABLE_NAME).key(warehouseID).get() as Warehouse;
    } 

    async createWarehouseIfNeeded(warehouseID: string) {
        const adal = this.papiClient.addons.data.uuid(this.addonUUID);
        // make sure the warehouse exists
        // if it doesn't create it and create a lock table for it
        try {
            await adal.table(WAREHOUSE_TABLE_NAME).key(warehouseID).get();
        }
        catch(err) {
            const warehouse: Warehouse = {
                Key: warehouseID,
                WarehouseID: warehouseID,
                TempAllocationTime: ORDER_TEMP_ALLOCATION_TIME_IN_MINUTES, // 1 minute
                Inventory: {}
            }

            console.log(`Creating warehouse: ${warehouseID} and lock table`);

            await adal.table(WAREHOUSE_TABLE_NAME).upsert(warehouse);

            // create the lock table
            const lockTable = warehouseID + WAREHOUSE_LOCK_TABLE_SUFFIX
            await this.papiClient.addons.data.schemes.post({
                Name: lockTable,
                Type: 'data'
            });
        }
    }

    async getWarehouses(options: any): Promise<Warehouse[]> {
        const adal = this.papiClient.addons.data.uuid(this.addonUUID);
        return await adal.table(WAREHOUSE_TABLE_NAME).iter(options).toArray() as Warehouse[];
    }

    async getUserAllocation(warehouseID: string, userUUID: string, item: string): Promise<UserAllocation | undefined> {
        const adal = this.papiClient.addons.data.uuid(this.addonUUID);
        const key = [warehouseID, userUUID, item].join('_');
        try {
            return await adal.table(USER_ALLOCATION_TABLE_NAME).key(key).get() as UserAllocation;
        }
        catch (err) {
            // todo: check that this is 404
            return undefined;
        }
    } 

    async getUserAllocations(options: any): Promise<UserAllocation[]> {
        return this.papiClient.addons.data.uuid(this.addonUUID).table(USER_ALLOCATION_TABLE_NAME).iter().toArray() as Promise<UserAllocation[]>;
    }

    async upsertUserAllocation(alloc: any) {
        const obj: UserAllocation = alloc;
        obj.Key = [obj.WarehouseID, obj.UserUUID, obj.ItemExternalID].join('_');
        const adal = this.papiClient.addons.data.uuid(this.addonUUID);
        return adal.table(USER_ALLOCATION_TABLE_NAME).upsert(obj) as Promise<UserAllocation>;
    }

    async getOrderAllocations(warehouseID: string): Promise<OrderAllocation[]> {
        const adal = this.papiClient.addons.data.uuid(this.addonUUID);
        return await adal.table(ORDER_ALLOCATION_TABLE_NAME).iter({
            where: `WarehouseID = '${warehouseID}'`
        }).toArray() as OrderAllocation[];
    }

    async calculateNewAllocations(orderAllocation: OrderAllocation, items: { [key: string]: number }) {
        let newAllocations: { [key: string]: number } = {};
            
        // subtract the orders existing allocations because they are already allocated
        // and either do not need to be reallocated or need to be put back in the inventory
        for (const item in orderAllocation.ItemAllocations) {
            newAllocations[item] = -(orderAllocation.ItemAllocations[item] || 0);
        }
        for (const item in orderAllocation.TempAllocation?.ItemAllocations || []) {
            newAllocations[item] = (newAllocations[item] || 0) - (orderAllocation.TempAllocation?.ItemAllocations[item] || 0);
        }

        // add the new values
        for (const item in items) {
            newAllocations[item] = (newAllocations[item] || 0) + items[item];
        }

        return newAllocations;
    }

    async checkAllocationAvailability(warehouse: Warehouse, userUUID: string, allocations: { [key: string]: number }) {
        const res: { 
            Success: boolean, 
            AllocationAvailability: { [key: string ]: number } 
        } = {
            Success: false,
            AllocationAvailability: {}
        };
        
        // check if allocation will succeed
        let allAllocated = true;
        for (const item in allocations) {
            const quantity = allocations[item];
            if (quantity > 0) { // else always succeeds
                // see if the warehouse is enough
                let available = warehouse.Inventory[item] || 0;

                // if not check if there is a user allocaiton
                if (available < quantity) {
                    const userAllocation = await this.getUserAllocation(warehouse.WarehouseID, userUUID, item);
                    if (userAllocation && userAllocation.Allocated) {
                        available += userAllocation.RemainingAllocation;
                    }
                }
                
                if (available < quantity) {
                    // this means that it will be a temp allocation
                    allAllocated = false;
                    allocations[item] = available;

                    // mark this item in the res object
                    res.AllocationAvailability[item] = available;
                }
            }
        }

        return res;
    }
}
import { Client } from '@pepperi-addons/debug-server';
import { OrderAllocation, ORDER_ALLOCATION_TABLE_NAME, UserAllocation, USER_ALLOCATION_TABLE_NAME, Warehouse, WAREHOUSE_TABLE_NAME, WAREHOUSE_LOCK_TABLE_SUFFIX, WAREHOUSE_INVENTORY_UDT_NAME, USER_ALLOCATION_UDT_NAME } from '../entities';
import { performance } from 'perf_hooks'
import { AddonService } from './addon.service';
import { WarehouseLockService } from './warehouse-lock.service';
import { between, valueOrZero } from '../helpers';

const ORDER_TEMP_ALLOCATION_TIME_IN_MINUTES = 1;

export class InventoryAllocationService {

    addonService: AddonService;
    lockService: WarehouseLockService;

    constructor(private client: Client) {
        this.addonService = new AddonService(client);
        this.lockService = new WarehouseLockService(client);
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

        // make sure that the warehouse exists, if not - create it
        await this.createWarehouseIfNeeded(warehouseID);

        // update under lock
        await this.lockService.performInLock(warehouseID, async () => {
            const t0 = performance.now();

            // get the current warehouse object
            const warehouse = await this.getWarehouse(warehouseID);

            // get all the orders
            const orderAllocations = (await this.addonService.adal.table(ORDER_ALLOCATION_TABLE_NAME).iter({
                where: `WarehouseID = '${warehouseID}'` // hopefully an index
            }).toArray()) as OrderAllocation[];

            // subtract the order allocations per item
            for (const alloc of orderAllocations) {
                for (const item in alloc.ItemAllocations) {
                    inventories[item] = valueOrZero(inventories[item]) - valueOrZero(alloc.ItemAllocations[item]);
                }

                if (alloc.TempItemAllocations) {
                    for (const item in alloc.TempItemAllocations) {
                        inventories[item] = valueOrZero(inventories[item]) - valueOrZero(alloc.TempItemAllocations[item]);
                    }
                }
            }

            const userTotals: { [key: string]: number } = {}

            // get all the user allocations
            const userAllocations = (await this.addonService.adal.table(USER_ALLOCATION_TABLE_NAME).iter({
                where: `WarehouseID = '${warehouseID}' AND Allocated = true`
            }).toArray()) as UserAllocation[];

            // subtract the user allocations
            for (const alloc of userAllocations) {
                if (alloc.Allocated) { // double check
                    const allowed = Math.max(0, alloc.MaxAllocation - alloc.UsedAllocation);
                    const possible = inventories[alloc.ItemExternalID] || 0;
                    
                    userTotals[alloc.ItemExternalID] = (userTotals[alloc.ItemExternalID] || 0) + Math.min(allowed, possible);
                    inventories[alloc.ItemExternalID] = (inventories[alloc.ItemExternalID] || 0) - userTotals[alloc.ItemExternalID];

                    if (userTotals[alloc.ItemExternalID] === 0) {
                        delete userTotals[alloc.ItemExternalID];
                    }
                }
            }

            // update the warehouse
            warehouse.Inventory = inventories;
            warehouse.UserAllocations = userTotals;
            await this.addonService.adal.table(WAREHOUSE_TABLE_NAME).upsert(warehouse);

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
        // need to optimize - bulk upsert
        for (const order of orders) {
            await this.addonService.adal.table(ORDER_ALLOCATION_TABLE_NAME).upsert({
                Key: order.OrderUUID,
                Hidden: true
            });
        }
    }

    /**
     * Allocate item inventory for an order.
     * Takes into account user allocations and warehouse inventory.
     * This can also merge with an existing order allocation.
     * @param warehouseID the warehouse id
     * @param orderUUID the order id
     * @param userID the user id
     * @param items the items to allocate for the order
     * @returns 
     */
    async allocateOrderInventory(warehouseID: string, orderUUID: string, userID: string, items: { [key: string]: number }): Promise<{ Success: boolean, AllocationAvailability: { [key: string]: number } }> {
        let res: any = undefined;

        // first lock the warehouse
        await this.lockService.performInLock(warehouseID, async () => {

            let existing: OrderAllocation = {
                Key: orderUUID,
                OrderUUID: orderUUID,
                WarehouseID: warehouseID,
                UserID: userID,
                ItemAllocations: {},
                TempItemAllocations: undefined,
                TempAllocationExpires: 0
            };
            
            // check if there already is an order
            try {
                existing = await this.addonService.adal.table(ORDER_ALLOCATION_TABLE_NAME).key(orderUUID).get() as OrderAllocation;

                // users can change
                // we always use the last one
                existing.UserID = userID;
            }
            catch(err) {
                // todo: make sure the error is not found the orderUUID
            }

            // bring the warehouse inventory
            const warehouse = await this.getWarehouse(warehouseID);

            // 1. Calculate the amount to allocated or deallocate per item
            const newAllocations = await this.calculateNewAllocations(existing, items);

            // 2. Check if the allocation will succeed aka be a real allocation (not temp)
            res = await this.checkAllocationAvailability(warehouse, userID, newAllocations);

            // 3. Perform the allocation (update warehouse inventory & user allocation)
            await this.updateInventory(newAllocations, warehouseID, userID);

            // 4. Update the OrderAllocation object
            if (res.Success) {
                existing.TempAllocationExpires = 0;
                existing.TempItemAllocations = null;
                existing.ItemAllocations = items;
            }
            else {
                if (!existing.TempItemAllocations) {
                    existing.TempItemAllocations = {
                    }
                }

                // update the expiry date
                existing.TempAllocationExpires = (new Date(new Date().getTime() + warehouse.TempAllocationTime*60*1000)).getTime();

                // set the newAllocation in the TempAllocations
                for (const item in newAllocations) {
                    let quantity = newAllocations[item];
                    
                    // no temp allocation for this item yet, create it
                    if (existing.TempItemAllocations[item] === undefined) {
                        existing.TempItemAllocations[item] = 0;
                    }

                    // add quantity to temp allocation
                    existing.TempItemAllocations[item] += quantity;

                    // the quantity might be negative, in that case we might need to subtract from a real allocation
                    // after subtracting from the temp allocation
                    if (existing.TempItemAllocations[item] < 0) {
                        existing.ItemAllocations[item] += existing.TempItemAllocations[item];
                        existing.TempItemAllocations[item] = 0;
                    }
                }
            }

            // update the order allocation
            await this.addonService.adal.table(ORDER_ALLOCATION_TABLE_NAME).upsert(existing);
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
    async updateInventory(allocations: {[key: string]: number}, warehouseID: string, userID: string) {
        const warehouse = await this.getWarehouse(warehouseID);

        // update the inventory
        for (const item in allocations) {
            let quantity = allocations[item];
            const userAllocation = await this.getUserAllocation(warehouseID, userID, item);
            if (userAllocation && userAllocation.Allocated) {

                // calculate the amount to subtract from the users allocation
                let toSubtract = 0;
                if (quantity < 0) { 
                    // deallocation: upto max - (used + quantity)
                    // example:
                    // MaxAllocation: 20, UsedAllocation: 15, quantity: -8
                    // toSubtract = -5 (subtracting a negative number is adding)
                    toSubtract = -Math.min(-quantity, userAllocation.MaxAllocation - (userAllocation.UsedAllocation + quantity));
                }
                else if (quantity > 0) { 
                    // allocation
                    // upto the amount in the usr allocation
                    toSubtract = Math.min(quantity, warehouse.UserAllocations[item] || 0);

                    // upto the amount the user has left
                    toSubtract = Math.min(toSubtract, userAllocation.MaxAllocation - userAllocation.UsedAllocation);

                    // no less that 0 - b/c used can be > than max
                    toSubtract = Math.max(0, toSubtract);
                }
                
                warehouse.UserAllocations[item] = (warehouse.UserAllocations[item] || 0) - toSubtract;
                if (warehouse.UserAllocations[item] === 0) {
                    delete warehouse.UserAllocations[item];
                }

                quantity -= toSubtract;

                // used gets to total so that the user will not get any more allocation
                // can't be less than 0
                userAllocation.UsedAllocation += allocations[item];
                userAllocation.UsedAllocation = Math.max(0, userAllocation.UsedAllocation); 

                // update the user allocation
                await this.addonService.adal.table(USER_ALLOCATION_TABLE_NAME).upsert(userAllocation);
            }

            if (quantity != 0) {
                // if there still is quantities to add/subtract
                warehouse.Inventory[item] -= quantity;
            }
        }

        // update the warehouse
        await this.addonService.adal.table(WAREHOUSE_TABLE_NAME).upsert(warehouse);
    }

    /**
     * This is meant to run from a code job and reset and temporary allocations for orders and users
     * to deallocate them and put back into the user and/or warehouse inventory
     */
    async checkAllocations() {
        const t0 = performance.now();

        // get all warehouses
        const warehouses = await this.addonService.adal.table(WAREHOUSE_TABLE_NAME).iter({ fields: ['Key'] }).toArray();

        await Promise.all(warehouses.map(async obj => {
            
            // make sure the lock isn't stuck
            await this.lockService.checkForStaleLocks(obj.Key);
            
            // check the user allocations under lock
            await this.lockService.performInLock(obj.Key, async () => {

                // get all the order allocation that have expired
                let orderAllocations = await this.getOrderAllocations({
                    where: `WarehouseID = '${obj.Key}' AND TempAllocationExpires > 0 AND TempAllocationExpires < ${new Date().getTime()}`
                });

                for (const order of orderAllocations) {
                    // update all inventories to minues the amount reserved
                    const newAllocations = order.TempItemAllocations || {};
                    for (const item in newAllocations) {
                        newAllocations[item] = -newAllocations[item];
                    }

                    order.TempItemAllocations = null;
                    order.TempAllocationExpires = 0;

                    // update the inventories
                    await this.updateInventory(newAllocations, order.WarehouseID, order.UserID);

                    // update the order allocaiton
                    await this.addonService.adal.table(ORDER_ALLOCATION_TABLE_NAME).upsert(order);
                }
                
                // get the warehouse again under lock
                const warehouse = await this.addonService.adal.table(WAREHOUSE_TABLE_NAME).key(obj.Key).get() as Warehouse;
                
                let warehouseChanged = false;

                // get all the user allocation
                let userAllocations = await this.addonService.adal.table(USER_ALLOCATION_TABLE_NAME).iter({
                    where: `WarehouseID = '${warehouse.WarehouseID}'`
                }).toArray() as UserAllocation[];

                // calculate the total user allocations
                // and update the userAllocations
                const totalUserAllocation: { [key: string]: number } = {};
                for (const userAllocation of userAllocations) {
                    const validNow = between(new Date(), new Date(userAllocation.StartDateTime), new Date(userAllocation.EndDateTime));
                    const item = userAllocation.ItemExternalID;

                    if (validNow != userAllocation.Allocated) {
                        userAllocation.Allocated = validNow;
                        
                        // reset used
                        userAllocation.UsedAllocation = 0;
                        
                        // update user allocation
                        await this.addonService.adal.table(USER_ALLOCATION_TABLE_NAME).upsert(userAllocation);
                    }

                    if (userAllocation.Allocated) {
                        const userTotal = Math.max(0, userAllocation.MaxAllocation - userAllocation.UsedAllocation);
                        totalUserAllocation[item] = (totalUserAllocation[item] || 0) + userTotal;
                    }
                }

                for (const item in warehouse.Inventory) {
                    let diff = (totalUserAllocation[item] || 0) - (warehouse.UserAllocations[item] || 0);
                    
                    // only up to the amount in the inventory
                    diff = Math.min(diff, warehouse.Inventory[item]);
                    
                    if (diff) {
                        warehouseChanged = true;

                        // move the diff from the inventory to the users allocation
                        warehouse.Inventory[item] = warehouse.Inventory[item] - diff;
                        warehouse.UserAllocations[item] = (warehouse.UserAllocations[item] || 0) + diff;

                        if (warehouse.UserAllocations[item] === 0) {
                            delete warehouse.UserAllocations[item];
                        }
                    }
                }

                if (warehouseChanged) {
                    await this.addonService.adal.table(WAREHOUSE_TABLE_NAME).upsert(warehouse);
                }
            });
        }));

         // update the UDT if the warehouse and/or has changed in the last 5 minutes
         try {
            const warehouses = await this.getWarehouses({
                where: `ModificationDateTime > ${new Date(new Date().getTime() - 5*60*1000).getTime()}`
            })
            console.log(`${warehouses.length} warehouses have changed in the last 5 minutes`);
            if (warehouses.length) {
                this.addonService.papiClient.userDefinedTables.batch(
                    warehouses.map(
                        warehouse => Object.keys(warehouse.Inventory).map(
                            item => {
                                return {
                                    MapDataExternalID: WAREHOUSE_INVENTORY_UDT_NAME,
                                    MainKey: warehouse.Key,
                                    SecondaryKey: item,
                                    Values: [
                                        JSON.stringify({
                                            Quantity: warehouse.Inventory[item],
                                            UserAllocations: warehouse.UserAllocations[item]
                                        })
                                    ]
                                }
                            }
                        )
                    ).flat()
                );
            }

            // update User Allocations UDT
            const userAllocations = await this.getUserAllocations({
                where: `ModificationDateTime > ${new Date(new Date().getTime() - 5*60*1000).getTime()}`
            });
            console.log(`${userAllocations.length} user allocations have changed in the last 5 minutes`);
            if (userAllocations.length > 0) {
                this.addonService.papiClient.userDefinedTables.batch(
                    userAllocations.map(userAllocation => {
                        return {
                            MapDataExternalID: USER_ALLOCATION_UDT_NAME,
                            MainKey: userAllocation.UserID,
                            SecondaryKey: [userAllocation.WarehouseID, userAllocation.ItemExternalID].join('_'),
                            Values: [JSON.stringify({
                                Allocated: userAllocation.Allocated,
                                UsedAllocation: userAllocation.UsedAllocation,
                                MaxAllocation: userAllocation.MaxAllocation
                            })]
                        }
                    })
                )
            }
        }
        catch(err) {
            console.log("error updating UDTs: ", err);
        }

        const t1 = performance.now();
        console.log(`check allocations took: ${(t1-t0).toFixed(2)} with ${warehouses.length} warehouses`)
    }

    async getWarehouse(warehouseID: string): Promise<Warehouse> {
        return await this.addonService.adal.table(WAREHOUSE_TABLE_NAME).key(warehouseID).get() as Warehouse;
    } 

    async createWarehouseIfNeeded(warehouseID: string) {
        // make sure the warehouse exists
        // if it doesn't create it and create a lock table for it
        try {
            await this.addonService.adal.table(WAREHOUSE_TABLE_NAME).key(warehouseID).get();
        }
        catch(err) {
            const warehouse: Warehouse = {
                Key: warehouseID,
                WarehouseID: warehouseID,
                TempAllocationTime: ORDER_TEMP_ALLOCATION_TIME_IN_MINUTES, // 1 minute
                Inventory: {},
                UserAllocations: {}
            }

            console.log(`Creating warehouse: ${warehouseID} and lock table`);

            await this.addonService.adal.table(WAREHOUSE_TABLE_NAME).upsert(warehouse);

            // create the lock table
            const lockTable = warehouseID + WAREHOUSE_LOCK_TABLE_SUFFIX
            await this.addonService.papiClient.addons.data.schemes.post({
                Name: lockTable,
                Type: 'data'
            });
        }
    }

    async getWarehouses(options: any): Promise<Warehouse[]> {
        return await this.addonService.adal.table(WAREHOUSE_TABLE_NAME).iter(options).toArray() as Warehouse[];
    }

    async getUserAllocation(warehouseID: string, userID: string, item: string): Promise<UserAllocation | undefined> {
        const key = [warehouseID, userID, item].join('_');
        try {
            return await this.addonService.adal.table(USER_ALLOCATION_TABLE_NAME).key(key).get() as UserAllocation;
        }
        catch (err) {
            // todo: check that this is 404
            return undefined;
        }
    } 

    async getUserAllocations(options: any): Promise<UserAllocation[]> {
        return this.addonService.adal.table(USER_ALLOCATION_TABLE_NAME).iter(options).toArray() as Promise<UserAllocation[]>;
    }

    async upsertUserAllocation(alloc: any) {
        const obj: UserAllocation = alloc;
        obj.Key = [obj.WarehouseID, obj.UserID, obj.ItemExternalID].join('_');
        return this.addonService.adal.table(USER_ALLOCATION_TABLE_NAME).upsert(obj) as Promise<UserAllocation>;
    }

    async getOrderAllocations(options): Promise<OrderAllocation[]> {
        return await this.addonService.adal.table(ORDER_ALLOCATION_TABLE_NAME).iter(options).toArray() as OrderAllocation[];
    }

    async calculateNewAllocations(orderAllocation: OrderAllocation, items: { [key: string]: number }) {
        let newAllocations: { [key: string]: number } = {};
            
        // subtract the orders existing allocations because they are already allocated
        // and either do not need to be reallocated or need to be put back in the inventory
        for (const item in orderAllocation.ItemAllocations) {
            newAllocations[item] = -(orderAllocation.ItemAllocations[item] || 0);
        }
        if (orderAllocation.TempItemAllocations) {
            for (const item in orderAllocation.TempItemAllocations) {
                newAllocations[item] = (newAllocations[item] || 0) - (orderAllocation.TempItemAllocations[item] || 0);
            }
        }

        // add the new values
        for (const item in items) {
            newAllocations[item] = (newAllocations[item] || 0) + items[item];
        }

        return newAllocations;
    }

    async checkAllocationAvailability(warehouse: Warehouse, userID: string, allocations: { [key: string]: number }) {
        const res: { 
            Success: boolean, 
            AllocationAvailability: { [key: string ]: number } 
        } = {
            Success: true,
            AllocationAvailability: {}
        };
        
        // check if allocation will succeed
        for (const item in allocations) {
            const quantity = allocations[item];
            if (quantity > 0) { // else always succeeds
                // see if the warehouse is enough
                let available = warehouse.Inventory[item] || 0;

                // if not check if there is a user allocaiton
                if (available < quantity) {
                    const userAllocation = await this.getUserAllocation(warehouse.WarehouseID, userID, item);
                    if (userAllocation && userAllocation.Allocated) {
                        const remaining = Math.max(0, userAllocation.MaxAllocation - userAllocation.UsedAllocation);
                        const totalUserAllocations = warehouse.UserAllocations[item];
                        available += Math.min(remaining, totalUserAllocations);
                    }
                }
                
                if (available < quantity) {
                    // this means that it will be a temp allocation
                    res.Success = false;
                    allocations[item] = available;

                    // mark this item in the res object
                    res.AllocationAvailability[item] = available;
                }
            }
        }

        return res;
    }
}
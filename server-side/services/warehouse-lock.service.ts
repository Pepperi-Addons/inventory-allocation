import { Client } from "@pepperi-addons/debug-server";
import { WAREHOUSE_LOCK_TABLE_SUFFIX } from "../entities";
import { v4 as uuid } from "uuid";
import { AddonService } from "./addon.service";
import { sleep } from "../helpers";
import { performance } from 'perf_hooks'

const MAXIMUM_LOCK_WAITING_TIME_IN_MS = 22000;
const LOCK_WAITING_ITERATION_TIME_IN_MS = 150;

export class WarehouseLockService {

    addonService: AddonService;

    constructor(client: Client) {
        this.addonService = new AddonService(client);
    }

    /**
     * Waits until the warehouse is locked for update
     * throws an exception if the warehouse can't be locked
     * @param warehouseID the warehouse UUID
     * 
     * @returns the key to unlock the warehouse
     */
     private async waitOnLockWarehouse(warehouseID: string): Promise<string> {
        const key = uuid();

        const table = warehouseID + WAREHOUSE_LOCK_TABLE_SUFFIX;
        const adal = this.addonService.papiClient.addons.data.uuid(this.addonService.addonUUID).table(table);

        // create a warehouse lock object
        await adal.upsert({
            Key: key
        });

        try {
            // wait until you are the first in line
            // wait a maximum of 30
            let first = false;
            const startedWaiting = new Date();
            const waitUntil = new Date(startedWaiting.getTime() + MAXIMUM_LOCK_WAITING_TIME_IN_MS) ;

            while (!first) {
                const l = await adal.find({
                    // page_size: 1, doesn't work - returns empty array
                    order_by: 'CreationDateTime',
                    fields: ['Key']
                });

                if (l.length === 0) {
                    // DynamoDB consistant up to 1.5 seconds
                    if (new Date().getTime() - startedWaiting.getTime() > 1700) {
                        throw new Error(`Error locking the warehouse: The lock table still returning an empty array after ${new Date().getTime() - startedWaiting.getTime()}ms`);
                    }
                }
                else if (l[0].Key === key) {
                    first = true;
                }
                else {
                    if (new Date() >= waitUntil) {
                        throw new Error(`Timeout (${MAXIMUM_LOCK_WAITING_TIME_IN_MS}ms) waiting for lock with key: ${key}.`)
                    }

                    // you are not the first -- wait until you are
                    console.log(`Waiting for the lock to be free. Current lock: ${l[0].Key}`);
                    await sleep(LOCK_WAITING_ITERATION_TIME_IN_MS);
                }
            }
        }
        catch (err) {
            // remove the lock object
            await this.unlockWarehouse(key, warehouseID);
            throw err;
        }

        return key;
    }

    /**
     * Unlock the warehouse
     * @param key 
     * @param warehouseID 
     */
    private async unlockWarehouse(key: string, warehouseID: string): Promise<void> {
        const table = warehouseID + WAREHOUSE_LOCK_TABLE_SUFFIX;
        const adal = this.addonService.papiClient.addons.data.uuid(this.addonService.addonUUID).table(table);

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

            const t2 = performance.now();
            console.log(`Performing block operation under lock took: ${(t2-t1).toFixed(2)}ms`);
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

    async checkForStaleLocks(warehouseID: string) {
        const locks = await this.addonService.adal.table(warehouseID + WAREHOUSE_LOCK_TABLE_SUFFIX).iter({
            fields: ['Key', 'CreationDateTime']
        }).toArray();
        for (const lock of locks) {
            if (new Date(lock.CreationDateTime!) < new Date(new Date().getTime() - 60*1000)) {
                console.log(`Removing lock with key: ${lock.Key}. Created: ${lock.CreationDateTime}`);
                await this.addonService.adal.table(warehouseID + WAREHOUSE_LOCK_TABLE_SUFFIX).upsert({
                    Key: lock.Key,
                    Hidden: true
                })
            }
        }
    }
}
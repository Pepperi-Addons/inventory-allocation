import { PapiClient } from '@pepperi-addons/papi-sdk';
import { PapiBaseURL, JWT } from '../env.json'
import { AddonUUID, AddonVersion } from '../../addon.config.json'
import { Warehouse } from '../../server-side/entities';

export class ApiClient {
    papiClient = new PapiClient({
        baseURL: PapiBaseURL,
        token: JWT
    });
      
    private addonApi: typeof PapiClient.prototype.addons.api = this.papiClient.addons.api.uuid(AddonUUID).file('inventory_allocation');
     
    async install() {
        const job = await this.papiClient.post(`/addons/installed_addons/${AddonUUID}/install/${AddonVersion}`);

        let audit;
        do {
            audit = await this.papiClient.get(job.URI);
            console.log("Status: " + audit.Status.Name);
        } while (audit.Status.Name !== 'Failure' && audit.Status.Name !== 'Success');


        if (audit.Status.Name === 'Failure') {
            throw new Error("Installation failed with error: " + audit.AuditInfo.ErrorMessage);
        }
    }

    async uninstall() {
        const job = await this.papiClient.post(`/addons/installed_addons/${AddonUUID}/uninstall`);

        let audit;
        do {
            audit = await this.papiClient.get(job.URI);
            console.log("Status: " + audit.Status.Name);
        } while (audit.Status.Name !== 'Failure' && audit.Status.Name !== 'Success');


        if (audit.Status.Name === 'Failure') {
            throw new Error("Uninstallation failed with error: " + audit.AuditInfo.ErrorMessage);
        }
    }

    rebase(warehouseID: string, items: { [key: string]: number }) {
        return this.addonApi.func('rebase_inventory').post({}, {
            WarehouseID: warehouseID,
            Items: items
        });
    }
      
    getWarehouse(warehouseID: string): Promise<Warehouse> {
        return this.addonApi.func(`warehouses?where=WarehouseID='${warehouseID}'`).get().then(obj => obj[0]);
    }

    createUserAllocation(warehouseID: string, userID: string, itemID: string, maxAllocation: number, startDate: Date, endDate: Date) {
        return this.addonApi.func(`user_allocations`).post({}, {
            WarehouseID: warehouseID,
            UserID: userID, 
            ItemExternalID: itemID,
            StartDateTime: startDate.toISOString(),
            EndDateTime: endDate.toISOString(),
            MaxAllocation: maxAllocation,
            UsedAllocation: 0
        });
    }
      
    allocatedOrder(warehouseID: string, orderUUID: string, userID: string, lines: {
        UnitsQuantity: number;
        ItemExternalID: string;
    }[]): Promise<{
        Success: boolean;
        AllocationAvailability: { [key: string]: number }
    }> {
        return this.addonApi.func(`allocate_inventory`).post({}, {
            WarehouseID: warehouseID,
            UserID: userID,
            OrderUUID: orderUUID,
            Lines: lines
        });
    }

    forceResetAllocations() {
        return this.addonApi.func('reset_allocations').post({},{});
    }

    getOrderAllocations() {
        return this.addonApi.func('order_allocations').get();
    }

    commitAllocations(warehouseID: string, orders: string[]) {
        return this.addonApi.func('commit_allocations').post({}, {
            WarehouseID: warehouseID,
            Orders: orders.map(o => {
                return {
                    OrderUUID: o
                }
            })
        })
    }

    getUserAllocation() {
        return this.addonApi.func(`user_allocations`).get();
    }

    rebaseAll(commitedOrders: string[], canceledOrders: string[], warehouses: {
        WarehouseID: string,
        Items: {
            [key: string]: number
        }
    }[]) {
        return this.addonApi.func('rebase_all').post({}, {
            CommitedOrders: commitedOrders,
            CanceledOrders: canceledOrders,
            Warehouses: warehouses
        })
    }
}
import { InventoryAllocationService } from './services/inventory-allocation.service'
import { Client, Request } from '@pepperi-addons/debug-server'

/**
 * POST /inventory_allocation/rebase_inventory
 * Body Params:
 *  - WarehouseID: string
 *  - Items: { [key: string]: number }
 * ---------------------------------------------
 * Update Inventories in a warehouse
 * Creates the warehouse if it doesn't yet exist
 * Sets the inventories after subtracting user & order allocations
 * Updates the UDT inventory table
 */
export async function rebase_inventory(client, request: Request) {
    const service = new InventoryAllocationService(client);
    return service.rebaseInventories(request.body.WarehouseID, request.body.Items);
}

/**
 * POST /inventory_allocation/allocate_inventory
 * BodyParams
 *  - WarehouseID: string
 *  - OrderUUID: string
 *  - UserID: string
 *  - Lines: { ItemExtenalID: string, UnitsQuanitity: number }[]
 * Return
 *  - Success: boolean
 *  - AlocationAvailibilty: { [key: string]: number }
 * --------------------------------------------------------------
 * Allocate inventory for an order.
 * If the order exists - update/remove items
 * If there isn't enough of one of the items, the allocation will be temporary
 * And the endpoint will return Success=false AllocationAvailiblity=items that wern't full allocated
 */
export async function allocate_inventory(client, request: Request) {
    const service = new InventoryAllocationService(client);
    
    const items: { [key: string]: number } = {};
    for (const row of request.body.Lines) {
        items[row.ItemExternalID] = (items[row.ItemExternalID] || 0) + row.UnitsQuantity;
    }

    return await service.allocateOrderInventory(
        request.body.WarehouseID, 
        request.body.OrderUUID, 
        request.body.UserID, 
        items
    );
}

/**
 * POST /inventory_allocation/commit_allocations
 * BodyParams
 *  - WarehouseID
 *  - Orders: { OrderUUID: string }[]
 */
export async function commit_allocations(client, request: Request) {
    const service = new InventoryAllocationService(client);
    return service.commitAllocations(request.body.WarehouseID, request.body.Orders);
}

/**
 * @internal
* POST inventory_allocation/reset_allocations
 * -----------------------------------------------
 * Called from scheduled job every 5 minutes
 * Update User & Order allocation that need to be reset
 * Temp order allocations after the expiry date are deallocated to the warehouse
 * User allocations are allocated & dealloced here
 * Additionally, user allocations can be extended to the MaxAllocation here as well 
 * (if they weren't allocated entirely last time)
 */
export async function reset_allocations(client, reqeust: Request) {
    const service = new InventoryAllocationService(client);
    return service.checkAllocations();
}

/**
 * @internal
 * GET | POST /inventory_allocations/user_allocations
 * get/upsert user allocations
 */
export async function user_allocations(client, request: Request) {
    const service = new InventoryAllocationService(client);

    if (request.method === 'POST') {
        return service.upsertUserAllocation(request.body);
    }
    else if (request.method === 'GET') {
        return service.getUserAllocations(request.query);
    }
}

/**
 * @internal
 * GET /inventory_allocations/warehouses
 * get warehouses
 */
export async function warehouses(client, request) {
    const service = new InventoryAllocationService(client);
    return service.getWarehouses(request.query);
}

/**
 * GET /inventory_allocations/order_allocations
 * get user allocations
 */
export async function order_allocations(client, request) {
    const service = new InventoryAllocationService(client);
    return service.getOrderAllocations(request.query);
}
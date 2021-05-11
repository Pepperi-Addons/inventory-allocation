import { Addon, AddonData } from '@pepperi-addons/papi-sdk'

/**
 * ADAL object that holds the current inventory info per warehouse
 * This object will be held in the 'Warehouse' ADAL table 
 * under the key = WareHouseID
 */
export interface Warehouse extends AddonData {
    
    /**
     * The warehouse ID
     */
     WarehouseID: string;

    /**
     * Holds the available inventory per item ExternalID
     */
    Inventory: { [key: string]: number };

    /**
     * Holds the inventory allocated to specific users with UserAllocation
     */
    UserAllocations: { [key: string]: number }

    /**
     * The time allowed to temp allocation an order in minutes
     */
    TempAllocationTime: number;
}

/**
 *  Represents the current state of an order allocation
 *  This object in held per order in the 'OrderAllocation' ADAL table
 */
export interface OrderAllocation extends AddonData {

    // this will be the Key
    OrderUUID: string;

    /**
     * The last user that called 
     */
    UserID: string;

    WarehouseID: string;
    
    /**
     * Allocations that have already been approved and subtracted from the Inventory
     */
    ItemAllocations: { [key: string]: number }

    /**
     * The expirey date of the temp allocation in GMT ISO format
     */
    TempAllocationExpires: number;

    TempItemAllocations?: { [key: string]: number } | null
}

/**
 * Represents an Allocation of inventory for a user in a warehouse of an item.
 * The code_job allocates and deallocates the quantities here
 * per the StartDateTime and EndDateTime
 */
export interface UserAllocation extends AddonData {

    // Key = WarehouseID + '_' + UserID + '_' + ItemExternalID

    WarehouseID: string; 

    UserID: string;

    ItemExternalID: string;

    /**
     * Has the users items been allocated yet 
     * Meaning reduced from warehouse inventory
     * This is checked on the code_job 
     */
    Allocated: boolean;

    StartDateTime: string; 

    EndDateTime: string;

    /**
     * The max allocation for this user
     * This is the amount allocated from the inventory if there is enough
     */
    MaxAllocation: number;

    /**
     * When a user uses his allocation it is removed from the remaining allocation
     * and added here
     */
    UsedAllocation: number;
}

/**
 * This object represents a lock object on the warehouse
 * The OrderAllocation and InventoryAllocation objects per warehouse need to be locked before updating
 * This object is stored in an ADAL table per warehouse with the tablename = ${WarehouseID}_Lock
 */
export interface WarehouseLock extends AddonData {
       
}

export const ORDER_ALLOCATION_TABLE_NAME = 'OrderAllocation';
export const WAREHOUSE_TABLE_NAME = 'Warehouse';
export const USER_ALLOCATION_TABLE_NAME = 'UserAllocation';
export const USER_ALLOCATION_UDT_NAME = 'UserAllocation';
export const WAREHOUSE_INVENTORY_UDT_NAME = 'WarehouseInventory';
export const WAREHOUSE_LOCK_TABLE_SUFFIX = '_Lock';
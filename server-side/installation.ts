
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, erroeMessage:{the reason why it is false}}
The error Message is importent! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server'
import { PapiClient } from '@pepperi-addons/papi-sdk';
import { ORDER_ALLOCATION_TABLE_NAME, USER_ALLOCATION_TABLE_NAME, USER_ALLOCATION_UDT_NAME, WAREHOUSE_INVENTORY_UDT_NAME, WAREHOUSE_LOCK_TABLE_SUFFIX, WAREHOUSE_TABLE_NAME } from './entities';

export async function install(client: Client, request: Request): Promise<any> {
    const papiClient = new PapiClient({
        baseURL: client.BaseURL,
        token: client.OAuthAccessToken,
        addonUUID: client.AddonUUID,
        addonSecretKey: client.AddonSecretKey
    });

    await papiClient.addons.data.schemes.post({
        Name: WAREHOUSE_TABLE_NAME,
        Type: 'data',
        Fields: {
            WarehouseID: { Type: 'String' }
        }
    });

    await papiClient.addons.data.schemes.post({
        Name: ORDER_ALLOCATION_TABLE_NAME,
        Type: 'data',
        Fields: {
            WarehouseID: { Type: 'String' },
            UserID: { Type: 'String' }
        }
    });

    await papiClient.addons.data.schemes.post({
        Name: USER_ALLOCATION_TABLE_NAME,
        Type: 'data',
        Fields: {
            WarehouseID: { Type: 'String' },
            Allocated: { Type: 'Bool' }
        }
    });

    await papiClient.metaData.userDefinedTables.upsert({
        TableID: WAREHOUSE_INVENTORY_UDT_NAME,
        MainKeyType: {
            ID: 0,
            Name: ''
        },
        SecondaryKeyType: {
            ID: 0,
            Name: ''
        }
    });

    await papiClient.metaData.userDefinedTables.upsert({
        TableID: USER_ALLOCATION_UDT_NAME,
        MainKeyType: { // needs to be UserExternalID
            ID: 0,
            Name: ''
        },
        SecondaryKeyType: {
            ID: 0,
            Name: ''
        }
    });

    await papiClient.codeJobs.upsert({
        Type: 'AddonJob',
        CodeJobName: 'reset_allocations',
        Description: 'Resets the User & Order allocations for the inventory allocation addon',
        AddonPath: 'inventory_allocation',
        AddonUUID: client.AddonUUID,
        NumberOfTries: 1,
        IsScheduled: true,
        FunctionName: 'reset_allocations',
        CronExpression: '0/5 * * * *' // currently runs allways (weekends, non-work hours) TBD
    })

    return {success:true,resultObject:{}}
}

export async function uninstall(client: Client, request: Request): Promise<any> {
    const papiClient = new PapiClient({
        baseURL: client.BaseURL,
        token: client.OAuthAccessToken,
        addonUUID: client.AddonUUID,
        addonSecretKey: client.AddonSecretKey
    });

    const warehouses = await papiClient.addons.data.uuid(client.AddonUUID).table(WAREHOUSE_TABLE_NAME).iter({
        fields: ['Key']
    }).toArray();
    
    for (const warehouse of warehouses) {
        await papiClient.post(`/addons/data/schemes/${warehouse.Key}${WAREHOUSE_LOCK_TABLE_SUFFIX}/purge`)
    }
    
    await papiClient.post(`/addons/data/schemes/${WAREHOUSE_TABLE_NAME}/purge`);
    await papiClient.post(`/addons/data/schemes/${USER_ALLOCATION_TABLE_NAME}/purge`);
    await papiClient.post(`/addons/data/schemes/${ORDER_ALLOCATION_TABLE_NAME}/purge`);
    
    await papiClient.metaData.userDefinedTables.upsert({
        TableID: WAREHOUSE_INVENTORY_UDT_NAME,
        Hidden: true,
        MainKeyType: {
            ID: 0,
            Name: ''
        },
        SecondaryKeyType: {
            ID: 0,
            Name: ''
        }
    })
    await papiClient.metaData.userDefinedTables.upsert({
        TableID: USER_ALLOCATION_UDT_NAME,
        Hidden: true,
        MainKeyType: {
            ID: 0,
            Name: ''
        },
        SecondaryKeyType: {
            ID: 0,
            Name: ''
        }
    })
    
    const jobs = await papiClient.codeJobs.iter().toArray();
    for (const job of jobs) {
        if (job.CodeJobName === 'reset_allocations') {
            await papiClient.codeJobs.upsert({
                UUID: job.UUID || '',
                CodeJobName: job.CodeJobName,
                CodeJobIsHidden: true,
            })
        }
    }

    return {success:true,resultObject:{}}
}

export async function upgrade(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

export async function downgrade(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}
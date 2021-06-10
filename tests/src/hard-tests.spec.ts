import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from './helpers';
import { ApiClient } from './api-client';

const apiClient = new ApiClient();

describe('Test Inventory', function () {

  before(() => apiClient.install());

  after(() => apiClient.uninstall());

    // describe("1 case - basic submit", () => {
    //   const warehouseID = uuid();
    //   const orderID = uuid();
    //   const user1 = uuid();
    //   let allocTime = new Date();

    //   it('First submit', async () => {
    //     await apiClient.rebase(warehouseID, {
    //       '1': 20,
    //       '2': 30
    //     });
  
    //     const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 10
    //       }
    //     ])
    //     allocTime = new Date();
    
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(res);
    //     console.log(warehouse);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(10);
    //     expect(res.Success).to.be.true;
    //     expect(res.AllocationAvailability['1']).to.be.undefined;
    //   })

    //   it('Second submit, dont change alloc and check inventory', async () => {  
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    
    //     expect(warehouse.Inventory['1']).to.be.equal(10);
    //   })
    // })

    // describe("2 case - basic submit with changing the qty on second submit", () => {
    //   const warehouseID = uuid();
    //   const orderID = uuid();
    //   const user1 = uuid();
    //   let allocTime = new Date();

    //   it('First submit', async () => {
    //     await apiClient.rebase(warehouseID, {
    //       '1': 100,
    //       '2': 30
    //     });
  
    //     const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 20
    //       }
    //     ])
    //     allocTime = new Date();
    
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(res);
    //     console.log(warehouse);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(80);
    //     expect(res.Success).to.be.true;
    //     expect(res.AllocationAvailability['1']).to.be.undefined;
    //   });

    //   // it('Wait 10 seconds', () => sleep(10 * 1000))

    //   it('Second submit, change alloc and rebase inventory', async () => {
  
    //     const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 40
    //       }
    //     ])
    //     allocTime = new Date();
    
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    
    //     console.log(res);
    //     console.log(warehouse);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(60);
    //     expect(res.Success).to.be.true;
    //     expect(res.AllocationAvailability['1']).to.be.undefined;
    //   })
    // });

    // describe("3 case - submit with multiple items", () => {
    //   const warehouseID = uuid();
    //   const orderID = uuid();
    //   const user1 = uuid();
    //   let allocTime = new Date();

    //   it('First submit', async () => {
    //     await apiClient.rebase(warehouseID, {
    //       '1': 100,
    //       '2': 50,
    //       '3': 500,
    //       '4': 200,
    //       '5': 150,
    //       '6': 350
    //     });
  
    //     const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 20
    //       },
    //       {
    //         ItemExternalID: '2',
    //         UnitsQuantity: 40
    //       },
    //       {
    //         ItemExternalID: '3',
    //         UnitsQuantity: 100
    //       },
    //       {
    //         ItemExternalID: '6',
    //         UnitsQuantity: 300
    //       }
    //     ])
    //     allocTime = new Date();
    
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(res);
    //     console.log(warehouse);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(80);
    //     expect(warehouse.Inventory['2']).to.be.equal(10);
    //     expect(warehouse.Inventory['3']).to.be.equal(400);
    //     expect(warehouse.Inventory['6']).to.be.equal(50);
    //     expect(res.Success).to.be.true;
    //     expect(res.AllocationAvailability['1']).to.be.undefined;
    //   });

    //   it('Second submit', async () => {
  
    //     const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 100
    //       },
    //       {
    //         ItemExternalID: '2',
    //         UnitsQuantity: 30
    //       },
    //       {
    //         ItemExternalID: '3',
    //         UnitsQuantity: 50
    //       },
    //       {
    //         ItemExternalID: '6',
    //         UnitsQuantity: 10
    //       }
    //     ])
    //     allocTime = new Date();
    
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(res);
    //     console.log(warehouse);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(0);
    //     expect(warehouse.Inventory['2']).to.be.equal(40);
    //     expect(warehouse.Inventory['3']).to.be.equal(450);
    //     expect(warehouse.Inventory['6']).to.be.equal(40);
    //     expect(res.Success).to.be.false;
    //     expect(res.AllocationAvailability['1']).to.be.equals(60);
    //   });
    // });

    // describe("4 case - submit with the same items", () => {
    //   const warehouseID = uuid();
    //   const orderID = uuid();
    //   const user1 = uuid();
    //   let allocTime = new Date();

    //   it('First submit', async () => {
    //     await apiClient.rebase(warehouseID, {
    //       '1': 500,
    //       '2': 50,
    //     });
  
    //     const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 50
    //       },
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 100
    //       },
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 25
    //       }
    //     ])
    //     allocTime = new Date();
    
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(res);
    //     console.log(warehouse);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(325);
    //     expect(res.Success).to.be.true;
    //     expect(res.AllocationAvailability['1']).to.be.undefined;
    //   });

    //   it('Second submit', async () => {
    //     await apiClient.rebase(warehouseID, {
    //       '1': 325,
    //       '2': 50
    //     });
  
    //     const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 10
    //       },
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 10
    //       },
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 30
    //       },
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 40
    //       }
    //     ])
    //     allocTime = new Date();
    
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(res);
    //     console.log(warehouse);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(235);
    //     expect(res.Success).to.be.true;
    //     expect(res.AllocationAvailability['1']).to.be.undefined;
    //   });
    // });

    // describe("5 case - submit with a lot of items", () => {
    //   const warehouseID = uuid();
    //   const orderID = uuid();
    //   const user1 = uuid();
    //   let allocTime = new Date();

    //   it('First submit - order should be successful', async () => {
    //     var items: {[k: string]: any} = {};

    //     for (var i = 1; i < 100; i++) {
    //       var str = i.toString();
    //       items[str] = 10000;
    //     }
        
    //     await apiClient.rebase(warehouseID, items);

    //     var lines = [];

    //     for (var i = 1; i < 100; i++) {
    //       var itemID = i.toString();
    //       lines.push({
    //         ItemExternalID: itemID,
    //         UnitsQuantity: 6000
    //       })
    //     }
  
    //     const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, lines)
    //     allocTime = new Date();
    
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(res);
    //     console.log(warehouse);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(4000);
    //     expect(warehouse.Inventory['2']).to.be.equal(4000);
    //     expect(warehouse.Inventory['3']).to.be.equal(4000);
    //     expect(res.Success).to.be.true;
    //     expect(res.AllocationAvailability['1']).to.be.undefined;
    //   });

    //   it('Second submit - order should be successful', async () => {
    //     var items: {[k: string]: any} = {};
    //     var lines = [];

    //     for (var i = 1; i < 100; i++) {
    //       var str = i.toString();
    //       items[str] = 4000;
    //     }

    //     await apiClient.rebase(warehouseID, items);

    //     for (var i = 1; i < 100; i++) {
    //       var itemID = i.toString();
    //       lines.push({
    //         ItemExternalID: itemID,
    //         UnitsQuantity: 3000
    //       })
    //     }
  
    //     const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, lines)
    //     allocTime = new Date();
    
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(res);
    //     console.log(warehouse);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(1000);
    //     expect(warehouse.Inventory['2']).to.be.equal(1000);
    //     expect(warehouse.Inventory['3']).to.be.equal(1000);
    //     expect(res.Success).to.be.true;
    //     expect(res.AllocationAvailability['1']).to.be.undefined;
    //   });

    //   it('Wait 10 seconds', () => sleep(10 * 1000));

    //   it('Third submit - should be fail - sometimes api call is taken to long', async () => {
    //     var items: {[k: string]: any} = {};
    //     var lines = [];

    //     for (var i = 1; i < 100; i++) {
    //       var str = i.toString();
    //       items[str] = 1000;
    //     }

    //     await apiClient.rebase(warehouseID, items);

    //     for (var i = 1; i < 100; i++) {
    //       var itemID = i.toString();
    //       lines.push({
    //         ItemExternalID: itemID,
    //         UnitsQuantity: 4000
    //       })
    //     }
  
    //     const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, lines)
    //     allocTime = new Date();
    
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(res);
    //     console.log(warehouse);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(0);
    //     expect(warehouse.Inventory['2']).to.be.equal(0);
    //     expect(warehouse.Inventory['3']).to.be.equal(0);
    //     expect(res.Success).to.be.false;
    //     expect(res.AllocationAvailability['1']).to.be.equals(-2000);
    //   });

    //   it('Forth submit - allocation should be more that available', async () => {
    //     var items: {[k: string]: any} = {};
    //     var lines = [];

    //     for (var i = 1; i < 100; i++) {
    //       var str = i.toString();
    //       items[str] = 1000;
    //     }

    //     await apiClient.rebase(warehouseID, items);

    //     for (var i = 1; i < 50; i++) {
    //       var itemID = i.toString();
    //       lines.push({
    //         ItemExternalID: itemID,
    //         UnitsQuantity: 2000
    //       })
    //     }
  
    //     const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, lines)
    //     allocTime = new Date();
    
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(res);
    //     console.log(warehouse);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(0);
    //     expect(warehouse.Inventory['2']).to.be.equal(0);
    //     expect(warehouse.Inventory['3']).to.be.equal(0);
    //     expect(res.Success).to.be.false;
    //     expect(res.AllocationAvailability['1']).to.be.equals(0);
    //   });

    //   it('Fifth submit - allocation should be more that available', async () => {
    //     var items: {[k: string]: any} = {};
    //     var lines = [];

    //     for (var i = 1; i < 100; i++) {
    //       var str = i.toString();
    //       items[str] = 1000;
    //     }

    //     await apiClient.rebase(warehouseID, items);

    //     for (var i = 1; i < 100; i++) {
    //       var itemID = i.toString();
    //       lines.push({
    //         ItemExternalID: itemID,
    //         UnitsQuantity: 4000
    //       })
    //     }
  
    //     const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, lines)
    //     allocTime = new Date();
    
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(res);
    //     console.log(warehouse);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(0);
    //     expect(warehouse.Inventory['2']).to.be.equal(0);
    //     expect(warehouse.Inventory['3']).to.be.equal(0);
    //     expect(res.Success).to.be.false;
    //     expect(res.AllocationAvailability['1']).to.be.equals(0);
    //   });
    
    // });

    // describe("6 case - submit with two users in order", () => {
    //   const warehouseID = uuid();
    //   const order1ID = uuid();
    //   const order2ID = uuid();
    //   const user1 = uuid();
    //   const user2 = uuid();
    //   let allocTime = new Date();

    //   it('First order - one user should go through and the second one should be the tempAlloc', async () => {
    //     var orders = [];
    //     orders.push(order1ID)
    //     orders.push(order2ID);

    //     await apiClient.rebase(warehouseID, {
    //       '1': 1000,
    //     });
  
    //     const resFirstUser = await apiClient.allocatedOrder(warehouseID, order1ID, user1, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 800
    //       }
    //     ])
    //     allocTime = new Date();
    //     const resSecondUser = await apiClient.allocatedOrder(warehouseID, order2ID, user2, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 800
    //       }
    //     ])

    //     let warehouse = await apiClient.getWarehouse(warehouseID);

    //     await apiClient.commitAllocations(warehouseID, orders)

    //     console.log(warehouse);
    //     console.log(resFirstUser);
    //     console.log(resSecondUser);

    //     expect(warehouse.Inventory['1']).to.be.equal(0);
    //     expect(resFirstUser.Success).to.be.true;
    //     expect(resFirstUser.AllocationAvailability['1']).to.be.undefined;
    //     expect(resSecondUser.Success).to.be.false;
    //     expect(resSecondUser.AllocationAvailability['1']).to.be.equals(200);
    //   });

    //   // Wait 1 minute and force reset
    //   it('Wait 10 seconds', () => sleep(10 * 1000)) 

    //   it('Force reset', async () => {
    //     await apiClient.forceResetAllocations();
    //   })

    //   it('Wait 10 seconds', () => sleep(10 * 1000)) 

    //   it('Get warehouse after reset', async () => {
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //   })

    //   it('Second submit - should success - both should be go through - one with already ordered alloc, the second one from tempAlloc to alloc ', async () => {     

    //     const resFirstUser = await apiClient.allocatedOrder(warehouseID, order1ID, user1, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 900
    //       }
    //     ])

    //     const resSecondUser = await apiClient.allocatedOrder(warehouseID, order2ID, user2, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 100
    //       }
    //     ])
    
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //     console.log(resFirstUser);
    //     console.log(resSecondUser);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(100);
    //     expect(resFirstUser.Success).to.be.false;
    //     expect(resFirstUser.AllocationAvailability['1']).to.be.equals(0);
    //     expect(resSecondUser.Success).to.be.true;
    //     expect(resSecondUser.AllocationAvailability['1']).to.be.undefined;
    //   });
    // });

    // describe("7 case - submit with two users at the same time", () => {
    //   const warehouseID = uuid();
    //   const order1ID = uuid();
    //   const order2ID = uuid();
    //   const order3ID = uuid();
    //   const order4ID = uuid();
    //   const user1 = uuid();
    //   const user2 = uuid();

    //   it('First order - one user should go through and the second one should be the tempAlloc - sometimes it can take more that it have', async () => {
    //     var orders = [];
    //     orders.push(order1ID)
    //     orders.push(order2ID);

    //     await apiClient.rebase(warehouseID, {
    //       '1': 1000,
    //     });

    //     const res = await Promise.all([
    //       apiClient.allocatedOrder(warehouseID, order1ID, user1, [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 800
    //         }
    //       ]), 
    //       apiClient.allocatedOrder(warehouseID, order2ID, user2, [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 800
    //         }
    //       ])
    //     ]).then(res => {
    //       return res;
    //     })

    //     let warehouse = await apiClient.getWarehouse(warehouseID);

    //     // await apiClient.commitAllocations(warehouseID, orders)

    //     console.log(warehouse);
    //     console.log(res);

    //     expect(warehouse.Inventory['1']).to.be.equal(0);
    //     if (res[0]["Success"]) {
    //       expect(res[0].Success).to.be.true;
    //       expect(res[0].AllocationAvailability['1']).to.be.undefined;
    //       expect(res[1].Success).to.be.false;
    //       expect(res[1].AllocationAvailability['1']).to.be.equals(200);  
    //     } else if (!res[0]["Success"]) {
    //       expect(res[0].Success).to.be.false;
    //       expect(res[0].AllocationAvailability['1']).to.be.equals(200);
    //       expect(res[1].Success).to.be.true;
    //       expect(res[1].AllocationAvailability['1']).to.be.undefined;
    //     }
    //   });

    //   // Wait 1 minute and force reset (with one second it won't work)
    //   it('Wait 1 seconds', () => sleep(1 * 1000)) 

    //   it('Force reset', async () => {
    //     await apiClient.forceResetAllocations();
    //   })

    //   it('Get warehouse after reset', async () => {
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //   })

    //   it('Second submit - should success - both should be go through - one with already ordered alloc, the second one from tempAlloc to alloc ', async () => {     
    //     const res = await Promise.all([
    //       apiClient.allocatedOrder(warehouseID, order3ID, user1, [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 50
    //         }
    //       ]),
    //       apiClient.allocatedOrder(warehouseID, order4ID, user2, [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 50
    //         }
    //       ])
    //     ]).then(res => {
    //       return res;
    //     })
    
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //     console.log(res);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(100);
    //     expect(res[0].Success).to.be.false;
    //     expect(res[0].AllocationAvailability['1']).to.be.equals(0);
    //     expect(res[1].Success).to.be.true;
    //     expect(res[1].AllocationAvailability['1']).to.be.undefined;
    //   });
    // });

    // describe("8 case - submit with 2/3/10... users in order", () => {
    //   const warehouseID = uuid();
    //   const order1ID = uuid();
    //   const order2ID = uuid();
    //   const order3ID = uuid();
    //   const user1 = uuid();
    //   const user2 = uuid();
    //   const user3 = uuid();
    //   var userQty = 10;
    //   var finalOrder: any;

    //   it('First order - 5 users should go through and the other 5 should be blocked with 0 available', async () => {
    //     await apiClient.rebase(warehouseID, {
    //       '1': 1000,
    //     });

    //     for (var i = 0; i < userQty; i++) {
    //       var user = uuid();
    //       var order = uuid();
    //       finalOrder = await apiClient.allocatedOrder(warehouseID, order, user, [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 200
    //         }
    //       ])
    //     }

    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //     console.log(finalOrder);

    //     expect(warehouse.Inventory['1']).to.be.equal(0);
    //   });

    //   // Wait 5 minute and force reset
    //   it('Wait 5 seconds', () => sleep(5 * 1000)) 

    //   it('Force reset', async () => {
    //     await apiClient.forceResetAllocations();
    //   })

    //   it('Second order - everyone should not go through, because Inventory is 0 ', async () => {  
    //     const resUser1 = await apiClient.allocatedOrder(warehouseID, order1ID, user1, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 200
    //       }
    //     ])
    //     const resUser2 = await apiClient.allocatedOrder(warehouseID, order2ID, user2, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 200
    //       }
    //     ])
    //     const resUser3 = await apiClient.allocatedOrder(warehouseID, order3ID, user3, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 200
    //       }
    //     ])
    
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //     console.log(resUser1);
    //     console.log(resUser2);
    //     console.log(resUser3);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(0);
    //     expect(resUser1.Success).to.be.false;
    //     expect(resUser1.AllocationAvailability['1']).to.be.equals(0);
    //     expect(resUser2.Success).to.be.false;
    //     expect(resUser2.AllocationAvailability['1']).to.be.equals(0);
    //     expect(resUser3.Success).to.be.false;
    //     expect(resUser3.AllocationAvailability['1']).to.be.equals(0);
    //   });
    // });

    // describe("9 case - submit with 2/3/10... users at the same time", () => {
    //   const warehouseID = uuid();
    //   var userQty = 10;

    //   var usersID: string[] = [];
    //   var ordersID: string[] = [];
    //   var actualOrders:any [] = [];

    //   it('First order - 5 users should go through and the other 5 should be blocked and have a tempAlloc', async () => {
    //     var successOrders = 0;
    //     var failOrders = 0;
    //     await apiClient.rebase(warehouseID, {
    //       '1': 1000,
    //     });

    //     for(var i = 0; i < userQty; i++) {
    //       var userID = uuid();
    //       var orderID = uuid();
    //       actualOrders.push(
    //         apiClient.allocatedOrder(warehouseID, orderID, userID, [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 200
    //         }
    //       ])
    //       )
    //     }

    //     const res = await Promise.all(actualOrders).then(res => {
    //       return res;
    //     });

    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //     console.log(res);


    //     res.forEach(el => {
    //       if (el["Success"])
    //         successOrders++;
    //       else if (!el["Success"])
    //         failOrders++;
    //     })

    //     console.log("Success Orders = ", successOrders);
    //     console.log("Fail Orders = ", failOrders);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(0);
    //     expect(successOrders).to.be.equal(5);
    //     expect(failOrders).to.be.equal(5);
    //   });

    //   // Wait 1 minute and force reset
    //   it('Wait 1 minute', () => sleep(60 * 1000)) 

    //   it('Force reset', async () => {
    //     await apiClient.forceResetAllocations();
    //   })

    //   it('Second order - submitting 100 users at the same time - should fail - api timeout error', async () => {
    //     await apiClient.rebase(warehouseID, {
    //       '1': 1000,
    //     });

    //     var actualOrders = [];
        
    //     for(var i = 0; i < 100; i++) {
    //       var userID = uuid();
    //       var orderID = uuid();
    //       usersID.push(userID);
    //       ordersID.push(orderID);
    //       actualOrders.push(
    //         apiClient.allocatedOrder(warehouseID, orderID, userID, [
    //           {
    //             ItemExternalID: '1',
    //             UnitsQuantity: 200
    //           }
    //         ])
    //       )
    //     }

    //     const res = await Promise.all(actualOrders).then(res => {
    //       return res;
    //     });

    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //     console.log(res);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(0);
    //   });

    //   it('Wait 30 seconds', () => sleep(30 * 1000)) 

    //   it('Third submit - everyone should be blocked or api timeout error', async () => {          
    //     var actualOrders = [];
        
    //     for(var i = 0; i < 3; i++) {
    //       actualOrders.push(
    //         apiClient.allocatedOrder(warehouseID, ordersID[i], usersID[i], [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 200
    //         }
    //       ])
    //       )
    //     };

    //     const res = await Promise.all(actualOrders).then(res => {
    //       return res;
    //     });
    
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //     console.log(res);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(0);
    //   });
    // });

    // describe("10 case - basic order with UserAlloction", () => {
    //   const warehouseID = uuid();
    //   const orderID = uuid();
    //   const userID = uuid();

    //   it('Rebase warehouse', async () => {
    //     await apiClient.rebase(warehouseID, {
    //       '1': 50,
    //       '2': 20
    //     });
  
    //     const warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
  
    //     expect(warehouse.Inventory).to.be.deep.equals({
    //       '1': 50,
    //       '2': 20
    //     });
    //     expect(warehouse.UserAllocations).to.be.empty;
    //   })

    //   it('Allocate user', async () => {
    //     await apiClient.createUserAllocation(warehouseID, userID, '1', 20, yesterday(), tomorrow());
    //   });

    //   it('Force reset allocaitons', () => apiClient.forceResetAllocations());

    //   it('Check the the warehouse', async () => {
    //     const warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
  
    //     expect(warehouse.Inventory).to.be.deep.equals({
    //       '1': 30,
    //       '2': 20
    //     });
    //     expect(warehouse.UserAllocations['1']).to.be.equal(20);
    //   })


    //   it('Order 10 units from UserAlloc', async () => {
    //     const res = await apiClient.allocatedOrder(warehouseID, orderID, userID, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 10
    //       }
    //     ])

    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //     console.log(res);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(30);
    //     expect(warehouse.UserAllocations['1']).to.be.equal(10);
    //   });

    //   it('Order 20 units using both UserAlloc and InventoryQty - fail - must subtract from UserAlloc and Inventory', async () => {
    //     const res = await apiClient.allocatedOrder(warehouseID, orderID, userID, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 20
    //       }
    //     ])

    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //     console.log(res);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(20);
    //     expect(warehouse.UserAllocations['1']).to.be.equal(0);
    //   });

    //   it('Force reset', async () => {
    //     await apiClient.forceResetAllocations();
    //   })

    //   it('Order 20 units using both UserAlloc and InventoryQty - fail - must subtract from UserAlloc and Inventory', async () => {
    //     const res = await apiClient.allocatedOrder(warehouseID, orderID, userID, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 20
    //       }
    //     ])

    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //     console.log(res);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(0);
    //     expect(warehouse.UserAllocations['1']).to.be.equal(0);
    //   });

    // });

    // describe("11 case - Allocate a few users", () => {
    //   const warehouseID = uuid();
    //   const orderID = uuid();
    //   const orderID2 = uuid();
    //   const user1 = uuid();
    //   const user2 = uuid();
    //   const user3 = uuid();
    //   const user4 = uuid();
    //   const user5 = uuid();
    //   const user6 = uuid();

    //   it('Rebase warehouse', async () => {
    //     await apiClient.rebase(warehouseID, {
    //       '1': 100,
    //       '2': 50
    //     });
  
    //     const warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
  
    //     expect(warehouse.Inventory).to.be.deep.equals({
    //       '1': 100,
    //       '2': 50
    //     });
    //     expect(warehouse.UserAllocations).to.be.empty;
    //   })

    //   it('Allocate users', async () => {
    //     await apiClient.createUserAllocation(warehouseID, user1, '1', 50, yesterday(), tomorrow());
    //     await apiClient.createUserAllocation(warehouseID, user1, '2', 10, yesterday(), tomorrow());
    //     await apiClient.createUserAllocation(warehouseID, user2, '1', 20, yesterday(), tomorrow());
    //     // await apiClient.createUserAllocation(warehouseID, user3, '2', 30, yesterday(), tomorrow());
    //     // await apiClient.createUserAllocation(warehouseID, user4, '1', 30, yesterday(), tomorrow());
    //     // await apiClient.createUserAllocation(warehouseID, user5, '1', 15, yesterday(), tomorrow());
    //   });

    //   it('Force reset allocaitons', () => apiClient.forceResetAllocations());

    //   it('Check the the warehouse', async () => {
    //     const warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
  
    //     expect(warehouse.Inventory).to.be.deep.equals({
    //       '1': 25,
    //       '2': 10
    //     });
    //     expect(warehouse.UserAllocations['1']).to.be.equal(75);
    //     expect(warehouse.UserAllocations['2']).to.be.equal(40);
    //   })

    //   // it('Get User Allocation', async () =>  {
    //   //   const userAlloc = await apiClient.getUserAllocation();
    //   //   console.log(userAlloc);
    //   // });

    //   it('Order 40 units from UserAlloc', async () => {
    //     const res1 = await apiClient.allocatedOrder(warehouseID, orderID, user1, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 40
    //       }
    //     ])

    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //     console.log(res1);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(30);
    //     expect(warehouse.UserAllocations['1']).to.be.equal(30);
    //     expect(res1.Success).to.be.true;
    //     expect(res1.AllocationAvailability['1']).to.be.undefined;
    //   });

    //   it('With 10 UserAlloc left, order 50 units - should take remainings userAlloc and take InvenotoryQty - Ordered more that we have - make a tempAlloc', async () => {
    //     const res1 = await apiClient.allocatedOrder(warehouseID, orderID2, user1, [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 50
    //       }
    //     ])

    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //     console.log(res1);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(0);
    //     expect(warehouse.UserAllocations['1']).to.be.equal(0);
    //     expect(res1.Success).to.be.false;
    //     expect(res1.AllocationAvailability['1']).to.be.equal(40);
    //   });

    // });

    // describe("12 case - Allocate a lot of users in order", () => {
    //   const warehouseID = uuid();
    //   const orderID = uuid();
    //   const orderID2 = uuid();
    //   const orderID4 = uuid();
    //   const orderID5 = uuid();
    //   const orderID6 = uuid();
    //   const user1 = uuid();
    //   var itemsQty = 2;
    //   var userQty = 10;
    //   var items: {[k: string]: any} = {};
    //   var users: string[] = [];

    //   describe("Allocation a lot of users with a lot of items (one items after another) - should allocate", () => {
    //     it('Rebase warehouse', async () => {
    //       for (var i = 1; i <= itemsQty; i++) {
    //         var str = i.toString();
    //         items[str] = 10000;
    //       }
  
    //       await apiClient.rebase(warehouseID, items);
    
    //       const warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
    
    //       expect(warehouse.Inventory['1']).to.be.equal(10000);
    //       expect(warehouse.Inventory['2']).to.be.equal(10000);
    //       expect(warehouse.UserAllocations).to.be.empty;
    //     });

    //     it('Allocate users', async () => {

    //       for (var i = 0; i < userQty; i++) {
    //         var user = uuid();
    //         users.push(user)
    //       }
  
    //       // console.log(users);
  
    //       for (var i = 1; i <= userQty; i++) {
    //         await apiClient.createUserAllocation(warehouseID, users[i], '1', 100, yesterday(), tomorrow());
    //         await apiClient.createUserAllocation(warehouseID, users[i], '2', 100, yesterday(), tomorrow());
    //         console.log(`Allocation - Item №1/2, User №${i}`);
  
    //       }
    //     });
  
    //     it('Check the the warehouse - before reset', async () => {
    //       const warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
    
    //       expect(warehouse.Inventory['1']).to.be.equal(10000);
    //       expect(warehouse.UserAllocations['1']).to.be.undefined;
    //       expect(warehouse.UserAllocations['2']).to.be.undefined;
    //     })

    //     // it('Wait 2 second', () => sleep(2 * 1000))
  
    //     it('Force reset allocaitons', () => apiClient.forceResetAllocations());
  
    //     it('Check the the warehouse - after reset', async () => {
    //       const warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
    
    //       expect(warehouse.Inventory['1']).to.be.equal(9000);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(1000);
    //       expect(warehouse.UserAllocations['2']).to.be.equal(1000);
    //     })
  
    //     // it('Get User Allocation', async () =>  {
    //     //   const userAlloc = await apiClient.getUserAllocation();
    //     //   console.log("All user Allocation ", userAlloc.length);
    //     //   expect(userAlloc.length).to.be.equal(20);
    //     // });

    //   });

    //   describe("Allocation a lot of users with one item (one user after another) - should allocate", () => {
    //     var itemsQty = 1;
    //     var userQty = 20;
    //     var items: {[k: string]: any} = {};
    //     var users: string[] = [];

    //     it('Rebase warehouse', async () => {
    //       for (var i = 1; i <= itemsQty; i++) {
    //         var str = i.toString();
    //         items[str] = 10000;
    //       }
  
    //       await apiClient.rebase(warehouseID, items);
    
    //       const warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
    
    //       expect(warehouse.Inventory['1']).to.be.equal(10000);
    //       expect(warehouse.UserAllocations).to.be.empty;
    //     });

    //     it('Allocate users', async () => {

    //       for (var i = 0; i < userQty; i++) {
    //         var user = uuid();
    //         users.push(user)
    //       }
  
    //       // console.log(users);
  
    //       for (var i = 1; i <= userQty; i++) {
    //         await apiClient.createUserAllocation(warehouseID, users[i], '1', 100, yesterday(), tomorrow());
    //         // await apiClient.createUserAllocation(warehouseID, users[i], '2', 100, yesterday(), tomorrow());
    //         console.log(`Allocation - Item №1, User №${i}`);
  
    //       }
    //     });
  
    //     it('Check the the warehouse - before reset', async () => {
    //       const warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
    
    //       expect(warehouse.Inventory['1']).to.be.equal(10000);
    //       expect(warehouse.UserAllocations['1']).to.be.undefined;
    //       expect(warehouse.UserAllocations['2']).to.be.undefined;
    //     })
  
    //     it('Force reset allocaitons', () => apiClient.forceResetAllocations());
  
    //     it('Check the the warehouse - after reset', async () => {
    //       const warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
    
    //       expect(warehouse.Inventory['1']).to.be.equal(8000);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(2000);
    //     })
  
    //     // it('Get User Allocation', async () =>  {
    //     //   const userAlloc = await apiClient.getUserAllocation();
    //     //   console.log("All user Allocation ", userAlloc.length);
    //     //   expect(userAlloc.length).to.be.equal(20);
    //     // });

    //   });


    //   describe("Make basic orders with userAllocation", () => {
    //     it('Order 40 units from UserAlloc', async () => {
    //       const res1 = await apiClient.allocatedOrder(warehouseID, orderID, users[1], [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 40
    //         }
    //       ])
  
    //       let warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
    //       console.log(res1);
    
    //       expect(warehouse.Inventory['1']).to.be.equal(8000);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(1960);
    //       expect(res1.Success).to.be.true;
    //       expect(res1.AllocationAvailability['1']).to.be.undefined;
    //     });
  
    //     it('With 10 UserAlloc left, order 50 units - should take remainings userAlloc and take InvenotoryQty - Ordered more that we have - make a tempAlloc', async () => {
    //       const res1 = await apiClient.allocatedOrder(warehouseID, orderID2, users[1], [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 80
    //         }
    //       ])
  
    //       let warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
    //       console.log(res1);
    
    //       expect(warehouse.Inventory['1']).to.be.equal(7980);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(1900);
    //       expect(res1.Success).to.be.true;
    //       expect(res1.AllocationAvailability['1']).to.be.undefined;
    //     });
    //   })

    //   describe("Make complicate orders with userAllocation", () => {
    //     it('Order 100 and 300 units with different users', async () => {
    //       const res1 = await apiClient.allocatedOrder(warehouseID, orderID, users[1], [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 200
    //         }
    //       ])
    //       const res2 = await apiClient.allocatedOrder(warehouseID, orderID2, users[2], [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 300
    //         }
    //       ])
  
    //       let warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
    //       console.log(res1);
    
    //       expect(warehouse.Inventory['1']).to.be.equal(7600);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(1900);
    //       expect(res1.Success).to.be.true;
    //       expect(res1.AllocationAvailability['1']).to.be.undefined;
    //     });
  
    //     it('Order with another users - should use the allocation or if its not enough, use Inventory qty', async () => {
    //       const res1 = await apiClient.allocatedOrder(warehouseID, orderID4, users[4], [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 90
    //         }
    //       ])
    //       const res2 = await apiClient.allocatedOrder(warehouseID, orderID5, users[5], [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 50
    //         }
    //       ])
    //       const res3 = await apiClient.allocatedOrder(warehouseID, orderID6, users[6], [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 300
    //         }
    //       ])
  
    //       let warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
    //       console.log(res1);
    //       console.log(res2);
    //       console.log(res3);
    
    //       expect(warehouse.Inventory['1']).to.be.equal(7300);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(1760);
    //       expect(res1.Success).to.be.true;
    //       expect(res1.AllocationAvailability['1']).to.be.undefined;
    //     });
    //   })
    // });
    
    // describe("13 case - Allocate a lot of users at the same time", () => {
    //   const warehouseID = uuid();
    //   const orderID = uuid();
    //   const orderID2 = uuid();
    //   var itemsQty = 40;
    //   var userQty = 10;
    //   var items: {[k: string]: any} = {};
    //   var users: string[] = [];

    //   it('Rebase warehouse', async () => {
    //     for (var i = 1; i < itemsQty; i++) {
    //       var str = i.toString();
    //       items[str] = 10000;
    //     }

    //     await apiClient.rebase(warehouseID, items);
  
    //     const warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(10000);
    //     expect(warehouse.Inventory['2']).to.be.equal(10000);
    //     expect(warehouse.Inventory['3']).to.be.equal(10000);
    //     expect(warehouse.Inventory['4']).to.be.equal(10000);
    //     expect(warehouse.UserAllocations).to.be.empty;
    //   })

    //   it('Allocate users', async () => {
    //     var userAllocations = [];

    //     for (var i = 0; i < userQty; i++) {
    //       var user = uuid();
    //       users.push(user)
    //     }

    //     for (var i = 0; i <= itemsQty; i++) {
    //       var itemID = i.toString();
    //       for (var j = 0; j < users.length; j++) {
    //         userAllocations.push(apiClient.createUserAllocation(warehouseID, users[j], itemID, 100, yesterday(), tomorrow()));
    //         console.log(`Allocation - Item №${i}, User №${j}`);
    //       }
    //     };

    //     const res = await Promise.all(userAllocations).then(res => {
    //       return res;
    //     });

    //   });

    //   it('Force reset allocaitons', () => apiClient.forceResetAllocations());

    //   it('Check the the warehouse', async () => {
    //     const warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
  
    //     expect(warehouse.Inventory['1']).to.be.deep.equal(9750);
    //   })

    //   // it('Get User Allocation', async () =>  {
    //   //   const userAlloc = await apiClient.getUserAllocation();
    //   //   console.log("All user Allocation ", userAlloc.length);
    //   // });

    //   it('Order 40 units from UserAlloc', async () => {
    //     const res1 = await apiClient.allocatedOrder(warehouseID, orderID, users[0], [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 40
    //       }
    //     ])

    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //     console.log(res1);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(30);
    //     expect(warehouse.UserAllocations['1']).to.be.equal(30);
    //     expect(res1.Success).to.be.true;
    //     expect(res1.AllocationAvailability['1']).to.be.undefined;
    //   });

    //   it('With 10 UserAlloc left, order 50 units - should take remainings userAlloc and take InvenotoryQty - Ordered more that we have - make a tempAlloc', async () => {
    //     const res1 = await apiClient.allocatedOrder(warehouseID, orderID2, users[0], [
    //       {
    //         ItemExternalID: '1',
    //         UnitsQuantity: 50
    //       }
    //     ])

    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //     console.log(res1);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(0);
    //     expect(warehouse.UserAllocations['1']).to.be.equal(0);
    //     expect(res1.Success).to.be.false;
    //     expect(res1.AllocationAvailability['1']).to.be.equal(40);
    //   });

    // });

    // describe("14 case - Allocate a lot of users in order, make a lot of orders with a lot of users and a lot of items", () => {
    //   const warehouseID = uuid();
    //   const order1ID = uuid();
    //   const order2ID = uuid();
    //   const order3ID = uuid();
    //   const user1 = uuid();
    //   const user2 = uuid();
    //   const user3 = uuid();
    //   var itemsQty = 40;
    //   var userQty = 20;
    //   var items: {[k: string]: any} = {};
    //   var lines: any[] = [];
    //   var users: string[] = [];
    //   var finalOrder: any;
    //   var actualOrders: any[] = [];

    //   it('Rebase warehouse', async () => {
    //     for (var i = 1; i <= itemsQty; i++) {
    //       var str = i.toString();
    //       items[str] = 10000;
    //     }
  
    //     await apiClient.rebase(warehouseID, items);
    
    //     const warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    
    //     expect(warehouse.Inventory['1']).to.be.equal(10000);
    //     expect(warehouse.Inventory['2']).to.be.equal(10000);
    //     expect(warehouse.Inventory['39']).to.be.equal(10000);
    //     expect(warehouse.Inventory['40']).to.be.equal(10000);
    //     expect(warehouse.UserAllocations).to.be.empty;
    //   });

    //   it('Allocate users', async () => {
    //     for (var i = 0; i < userQty; i++) {
    //       var user = uuid();
    //       users.push(user)
    //     }
        
    //     for (var i = 0; i < userQty; i++) {
    //       await apiClient.createUserAllocation(warehouseID, users[i], '1', 100, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, users[i], '2', 100, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, users[i], '10', 100, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, users[i], '15', 100, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, users[i], '35', 100, yesterday(), tomorrow());
    //       console.log(`Allocation - Item №1/2/10/15/35, User №${i}`);
    //     }
    //   });

    //   // it('Get User Allocation', async () =>  {
    //   //   const userAlloc = await apiClient.getUserAllocation();
    //   //   console.log(userAlloc.length);
    //   //   expect(userAlloc.length).to.be.equal(50);
    //   // });

    //   it('Check the the warehouse - before reset', async () => {
    //     const warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    
    //     expect(warehouse.Inventory['1']).to.be.equal(10000);
    //     expect(warehouse.UserAllocations['1']).to.be.undefined;
    //     expect(warehouse.UserAllocations['2']).to.be.undefined;
    //   })
  
    //   it('Force reset allocaitons', () => apiClient.forceResetAllocations());
  
    //   it('Check the the warehouse - after reset', async () => {
    //     const warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    
    //     expect(warehouse.Inventory['1']).to.be.equal(8000);
    //     expect(warehouse.Inventory['2']).to.be.equal(8000);
    //     expect(warehouse.Inventory['10']).to.be.equal(8000);
    //     expect(warehouse.Inventory['15']).to.be.equal(8000);
    //     expect(warehouse.Inventory['35']).to.be.equal(8000);
    //     expect(warehouse.UserAllocations['1']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['2']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['10']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['15']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['35']).to.be.equal(2000);
    //   })

    //   it('First case - make 30 orders in turn', async () => {
    //     var successOrders = 0;
    //     var failOrders = 0;
      
    //     // Collect items for order
    //     for (var i = 1; i <= itemsQty; i++) {
    //       var itemID = i.toString();
    //       lines.push({
    //         ItemExternalID: itemID,
    //         UnitsQuantity: 50
    //       })
    //     }

    //     for (var i = 0; i < userQty; i++) {
    //       // var user = uuid();
    //       var order = uuid();
    //       console.log(`Order #${i}`);
    //       finalOrder = await apiClient.allocatedOrder(warehouseID, order, users[i], lines);
          
    //       if (finalOrder["Success"])
    //         successOrders++;
    //       else if (!finalOrder["Success"])
    //         failOrders++;
    //     }

    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //     console.log(finalOrder);
    //     console.log("Success Orders = ", successOrders);
    //     console.log("Fail Orders = ", failOrders);

    //     expect(warehouse.Inventory['1']).to.be.equal(8000);
    //     expect(warehouse.Inventory['2']).to.be.equal(8000);
    //     expect(warehouse.Inventory['3']).to.be.equal(9000);
    //     expect(warehouse.Inventory['10']).to.be.equal(8000);
    //     expect(warehouse.Inventory['15']).to.be.equal(8000);
    //     expect(warehouse.Inventory['35']).to.be.equal(8000);
    //     expect(warehouse.UserAllocations['1']).to.be.equal(1000);
    //     expect(warehouse.UserAllocations['2']).to.be.equal(1000);
    //     expect(warehouse.UserAllocations['10']).to.be.equal(1000);
    //     expect(warehouse.UserAllocations['15']).to.be.equal(1000);
    //     expect(warehouse.UserAllocations['35']).to.be.equal(1000);
    //     expect(successOrders).to.be.equal(30);
    //     expect(failOrders).to.be.equal(0);
    //   });

    //   it('Check the the warehouse', async () => {
    //     const warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    
    //     expect(warehouse.Inventory['1']).to.be.equal(8000);
    //     expect(warehouse.Inventory['2']).to.be.equal(8000);
    //     expect(warehouse.Inventory['10']).to.be.equal(8000);
    //     expect(warehouse.Inventory['15']).to.be.equal(8000);
    //     expect(warehouse.Inventory['35']).to.be.equal(8000);
    //     expect(warehouse.UserAllocations['1']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['2']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['10']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['15']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['35']).to.be.equal(2000);
    //   })

    //   it('Second case - make 30 orders at the same time', async () => {
    //     var successOrders = 0;
    //     var failOrders = 0;
    //     var itemLines = [];

    //     for (var i = 1; i <= itemsQty; i++) {
    //       var itemID = i.toString();
    //       itemLines.push({
    //         ItemExternalID: itemID,
    //         UnitsQuantity: 500
    //       })
    //     }
        
    //     for(var i = 0; i < userQty; i++) {
    //       var orderID = uuid();
    //       actualOrders.push(
    //         apiClient.allocatedOrder(warehouseID, orderID, users[i], itemLines)
    //       )
    //     }
              
    //     const res = await Promise.all(actualOrders).then(res => {
    //       return res;
    //     });

    //     res.forEach(el => {
    //       if (el["Success"])
    //         successOrders++;
    //       else if (!el["Success"])
    //         failOrders++;
    //     })
      
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //     console.log(res);
    //     console.log("Success Orders = ", successOrders);
    //     console.log("Fail Orders = ", failOrders);
        
    //     expect(warehouse.Inventory['1']).to.be.equal(0);
    //     expect(successOrders).to.be.equal(5);
    //     expect(failOrders).to.be.equal(5);
    //   });

    //   it('Check the the warehouse', async () => {
    //     const warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    
    //     expect(warehouse.Inventory['1']).to.be.equal(8000);
    //     expect(warehouse.Inventory['2']).to.be.equal(8000);
    //     expect(warehouse.Inventory['10']).to.be.equal(8000);
    //     expect(warehouse.Inventory['15']).to.be.equal(8000);
    //     expect(warehouse.Inventory['35']).to.be.equal(8000);
    //     expect(warehouse.UserAllocations['1']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['2']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['10']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['15']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['35']).to.be.equal(2000);
    //   });

    // });    

    // describe("1- case - Allocate a lot of users in order, make a lot of orders with a lot of users and a lot of items", () => {
    //   const warehouseID = uuid();
    //   const order1ID = uuid();
    //   const order2ID = uuid();
    //   const order3ID = uuid();
    //   const user1 = uuid();
    //   const user2 = uuid();
    //   const user3 = uuid();
    //   var itemsQty = 40;
    //   var userQty = 20;
    //   var items: {[k: string]: any} = {};
    //   var lines: any[] = [];
    //   var users: string[] = [];
    //   var finalOrder: any;
    //   var actualOrders: any[] = [];

    //   it('Rebase warehouse', async () => {
    //     for (var i = 1; i <= itemsQty; i++) {
    //       var str = i.toString();
    //       items[str] = 10000;
    //     }
  
    //     await apiClient.rebase(warehouseID, items);
    
    //     const warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    
    //     expect(warehouse.Inventory['1']).to.be.equal(10000);
    //     expect(warehouse.Inventory['2']).to.be.equal(10000);
    //     expect(warehouse.Inventory['39']).to.be.equal(10000);
    //     expect(warehouse.Inventory['40']).to.be.equal(10000);
    //     expect(warehouse.UserAllocations).to.be.empty;
    //   });

    //   it('Allocate users', async () => {
    //     for (var i = 0; i < userQty; i++) {
    //       var user = uuid();
    //       users.push(user)
    //     }
        
    //     for (var i = 0; i < userQty; i++) {
    //       await apiClient.createUserAllocation(warehouseID, users[i], '1', 100, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, users[i], '2', 100, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, users[i], '10', 100, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, users[i], '15', 100, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, users[i], '35', 100, yesterday(), tomorrow());
    //       console.log(`Allocation - Item №1/2/10/15/35, User №${i}`);
    //     }
    //   });

    //   it('Check the the warehouse - before reset', async () => {
    //     const warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    
    //     expect(warehouse.Inventory['1']).to.be.equal(10000);
    //     expect(warehouse.UserAllocations['1']).to.be.undefined;
    //     expect(warehouse.UserAllocations['2']).to.be.undefined;
    //   })
  
    //   it('Force reset allocaitons', () => apiClient.forceResetAllocations());
  
    //   it('Check the the warehouse - after reset', async () => {
    //     const warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    
    //     expect(warehouse.Inventory['1']).to.be.equal(8000);
    //     expect(warehouse.Inventory['2']).to.be.equal(8000);
    //     expect(warehouse.Inventory['10']).to.be.equal(8000);
    //     expect(warehouse.Inventory['15']).to.be.equal(8000);
    //     expect(warehouse.Inventory['35']).to.be.equal(8000);
    //     expect(warehouse.UserAllocations['1']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['2']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['10']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['15']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['35']).to.be.equal(2000);
    //   })

    //   it('First case - make 30 orders in turn', async () => {
    //     var successOrders = 0;
    //     var failOrders = 0;
      
    //     // Collect items for order
    //     for (var i = 1; i <= itemsQty; i++) {
    //       var itemID = i.toString();
    //       lines.push({
    //         ItemExternalID: itemID,
    //         UnitsQuantity: 50
    //       })
    //     }

    //     for (var i = 0; i < userQty; i++) {
    //       // var user = uuid();
    //       var order = uuid();
    //       console.log(`Order #${i}`);
    //       finalOrder = await apiClient.allocatedOrder(warehouseID, order, users[i], lines);
          
    //       if (finalOrder["Success"])
    //         successOrders++;
    //       else if (!finalOrder["Success"])
    //         failOrders++;
    //     }

    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //     console.log(finalOrder);
    //     console.log("Success Orders = ", successOrders);
    //     console.log("Fail Orders = ", failOrders);

    //     expect(warehouse.Inventory['1']).to.be.equal(8000);
    //     expect(warehouse.Inventory['2']).to.be.equal(8000);
    //     expect(warehouse.Inventory['3']).to.be.equal(9000);
    //     expect(warehouse.Inventory['10']).to.be.equal(8000);
    //     expect(warehouse.Inventory['15']).to.be.equal(8000);
    //     expect(warehouse.Inventory['35']).to.be.equal(8000);
    //     expect(warehouse.UserAllocations['1']).to.be.equal(1000);
    //     expect(warehouse.UserAllocations['2']).to.be.equal(1000);
    //     expect(warehouse.UserAllocations['10']).to.be.equal(1000);
    //     expect(warehouse.UserAllocations['15']).to.be.equal(1000);
    //     expect(warehouse.UserAllocations['35']).to.be.equal(1000);
    //     expect(successOrders).to.be.equal(30);
    //     expect(failOrders).to.be.equal(0);
    //   });

    //   it('Check the the warehouse', async () => {
    //     const warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    
    //     expect(warehouse.Inventory['1']).to.be.equal(8000);
    //     expect(warehouse.Inventory['2']).to.be.equal(8000);
    //     expect(warehouse.Inventory['10']).to.be.equal(8000);
    //     expect(warehouse.Inventory['15']).to.be.equal(8000);
    //     expect(warehouse.Inventory['35']).to.be.equal(8000);
    //     expect(warehouse.UserAllocations['1']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['2']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['10']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['15']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['35']).to.be.equal(2000);
    //   })

    //   it('Second case - make 30 orders at the same time', async () => {
    //     var successOrders = 0;
    //     var failOrders = 0;
    //     var itemLines = [];

    //     for (var i = 1; i <= itemsQty; i++) {
    //       var itemID = i.toString();
    //       itemLines.push({
    //         ItemExternalID: itemID,
    //         UnitsQuantity: 500
    //       })
    //     }
        
    //     for(var i = 0; i < userQty; i++) {
    //       var orderID = uuid();
    //       actualOrders.push(
    //         apiClient.allocatedOrder(warehouseID, orderID, users[i], itemLines)
    //       )
    //     }
              
    //     const res = await Promise.all(actualOrders).then(res => {
    //       return res;
    //     });

    //     res.forEach(el => {
    //       if (el["Success"])
    //         successOrders++;
    //       else if (!el["Success"])
    //         failOrders++;
    //     })
      
    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    //     console.log(res);
    //     console.log("Success Orders = ", successOrders);
    //     console.log("Fail Orders = ", failOrders);
        
    //     expect(warehouse.Inventory['1']).to.be.equal(0);
    //     expect(successOrders).to.be.equal(5);
    //     expect(failOrders).to.be.equal(5);
    //   });

    //   it('Check the the warehouse', async () => {
    //     const warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);
    
    //     expect(warehouse.Inventory['1']).to.be.equal(8000);
    //     expect(warehouse.Inventory['2']).to.be.equal(8000);
    //     expect(warehouse.Inventory['10']).to.be.equal(8000);
    //     expect(warehouse.Inventory['15']).to.be.equal(8000);
    //     expect(warehouse.Inventory['35']).to.be.equal(8000);
    //     expect(warehouse.UserAllocations['1']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['2']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['10']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['15']).to.be.equal(2000);
    //     expect(warehouse.UserAllocations['35']).to.be.equal(2000);
    //   });

    // });  

    // describe("New 9 case - submit with 2/3/10... users at the same time", () => {
    //   const warehouseID = uuid();
    //   var ordersQty = 30;
    //   var orders: string[] = [];

    //   it('First order - Allocate 10 orders', async () => {
    //     var successOrders = 0;
    //     var failOrders = 0;
    //     await apiClient.rebase(warehouseID, {
    //       '1': 10000,
    //     });

    //     for (var i = 0; i < ordersQty; i++) {
    //       var order = uuid();
    //       orders.push(order)
    //     }

    //     await Promise.all(orders.map(order => (async () => {
    //       try {
    //         await apiClient.allocatedOrder(warehouseID, order, '', [
    //           {
    //             ItemExternalID: '1',
    //             UnitsQuantity: 200
    //           }
    //         ])
    //         successOrders++;
    //       } catch (error) {
    //         failOrders++;
    //       }
    //     })()))

    //     let warehouse = await apiClient.getWarehouse(warehouseID);
    //     console.log(warehouse);


    //     console.log("Success Orders = ", successOrders);
    //     console.log("Fail Orders = ", failOrders);
  
    //     expect(warehouse.Inventory['1']).to.be.equal(0);
    //     expect(successOrders + failOrders).to.be.equal(ordersQty);
    //   });

    //   // Wait 1 minute and force reset
    //   // it('Wait 1 minute', () => sleep(60 * 1000)) 

    //   // it('Force reset', async () => {
    //   //   await apiClient.forceResetAllocations();
    //   // })

    //   // it('Second order - submitting 100 users at the same time - should fail - api timeout error', async () => {
    //   //   await apiClient.rebase(warehouseID, {
    //   //     '1': 1000,
    //   //   });

    //   //   var actualOrders = [];
        
    //   //   for(var i = 0; i < 100; i++) {
    //   //     var userID = uuid();
    //   //     var orderID = uuid();
    //   //     usersID.push(userID);
    //   //     ordersID.push(orderID);
    //   //     actualOrders.push(
    //   //       apiClient.allocatedOrder(warehouseID, orderID, userID, [
    //   //         {
    //   //           ItemExternalID: '1',
    //   //           UnitsQuantity: 200
    //   //         }
    //   //       ])
    //   //     )
    //   //   }

    //   //   const res = await Promise.all(actualOrders).then(res => {
    //   //     return res;
    //   //   });

    //   //   let warehouse = await apiClient.getWarehouse(warehouseID);
    //   //   console.log(warehouse);
    //   //   console.log(res);
  
    //   //   expect(warehouse.Inventory['1']).to.be.equal(0);
    //   // });

    //   // it('Wait 30 seconds', () => sleep(30 * 1000)) 

    //   // it('Third submit - everyone should be blocked or api timeout error', async () => {          
    //   //   var actualOrders = [];
        
    //   //   for(var i = 0; i < 3; i++) {
    //   //     actualOrders.push(
    //   //       apiClient.allocatedOrder(warehouseID, ordersID[i], usersID[i], [
    //   //       {
    //   //         ItemExternalID: '1',
    //   //         UnitsQuantity: 200
    //   //       }
    //   //     ])
    //   //     )
    //   //   };

    //   //   const res = await Promise.all(actualOrders).then(res => {
    //   //     return res;
    //   //   });
    
    //   //   let warehouse = await apiClient.getWarehouse(warehouseID);
    //   //   console.log(warehouse);
    //   //   console.log(res);
  
    //   //   expect(warehouse.Inventory['1']).to.be.equal(0);
    //   // });
    // });

    // describe("Basic tests with multiple users, from spreadsheet", () => {
    //   describe("39 case - basic - with sufficient qty", async () => {
    //     const warehouseID = uuid();
    //     const orderID = uuid();
    //     const user = uuid();
    //     var itemsQty = 10;
    //     var items: {[k: string]: any} = {};

    //     it('Rebase warehouse', async () => {
    //       for (var i = 1; i <= itemsQty; i++) {
    //         var str = i.toString();
    //         items[str] = 600;
    //       }
    
    //       await apiClient.rebase(warehouseID, items);
      
    //       const warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
      
    //       expect(warehouse.Inventory['1']).to.be.equal(600);
    //       expect(warehouse.Inventory['2']).to.be.equal(600);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations).to.be.empty;
    //     });

    //     it('Allocate user', async () => {
    //       await apiClient.createUserAllocation(warehouseID, user, '1', 300, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, user, '2', 300, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, user, '3', 300, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, user, '4', 300, yesterday(), tomorrow());
    //     });

    //     it('Force reset allocaitons', () => apiClient.forceResetAllocations());

    //     it('Check the the warehouse', async () => {
    //       const warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
    
    //       expect(warehouse.Inventory['1']).to.be.equal(300);
    //       expect(warehouse.Inventory['2']).to.be.equal(300);
    //       expect(warehouse.Inventory['3']).to.be.equal(300);
    //       expect(warehouse.Inventory['4']).to.be.equal(300);
    //       expect(warehouse.Inventory['8']).to.be.equal(600);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['2']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['3']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['4']).to.be.equal(300);
    //     })

    //     it('Initial submit - order 100 of the BOGO item #1, order 200 of the BOGA item #2 + order 100 of the item #3, order 100 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
    //       const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 100
    //         },
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 100
    //         },
    //         {
    //           ItemExternalID: '2',
    //           UnitsQuantity: 200
    //         },
    //         {
    //           ItemExternalID: '3',
    //           UnitsQuantity: 100
    //         },            
    //         {
    //           ItemExternalID: '4',
    //           UnitsQuantity: 100
    //         }
    //       ])
      
    //       let warehouse = await apiClient.getWarehouse(warehouseID);
            
    //       console.log(warehouse);
    //       console.log(res);
      
    //       expect(warehouse.Inventory['1']).to.be.equal(300);
    //       expect(warehouse.Inventory['2']).to.be.equal(300);
    //       expect(warehouse.Inventory['3']).to.be.equal(300);
    //       expect(warehouse.Inventory['4']).to.be.equal(300);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(100);
    //       expect(warehouse.UserAllocations['2']).to.be.equal(100);
    //       expect(warehouse.UserAllocations['3']).to.be.equal(200);
    //       expect(warehouse.UserAllocations['4']).to.be.equal(200);
    //       expect(res.Success).to.be.true;
    //       expect(res.AllocationAvailability['1']).to.be.undefined;
    //     });
    //   })

    //   describe("40 case - modification qty - with sufficient qty", async () => {
    //     const warehouseID = uuid();
    //     const orderID = uuid();
    //     const user = uuid();
    //     var itemsQty = 10;
    //     var items: {[k: string]: any} = {};

    //     it('Rebase warehouse', async () => {
    //       for (var i = 1; i <= itemsQty; i++) {
    //         var str = i.toString();
    //         items[str] = 600;
    //       }
    
    //       await apiClient.rebase(warehouseID, items);
      
    //       const warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
      
    //       expect(warehouse.Inventory['1']).to.be.equal(600);
    //       expect(warehouse.Inventory['2']).to.be.equal(600);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations).to.be.empty;
    //     });

    //     it('Allocate user', async () => {
    //       await apiClient.createUserAllocation(warehouseID, user, '1', 300, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, user, '2', 300, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, user, '3', 300, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, user, '4', 300, yesterday(), tomorrow());
    //     });

    //     it('Force reset allocaitons', () => apiClient.forceResetAllocations());

    //     it('Check the the warehouse', async () => {
    //       const warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
    
    //       expect(warehouse.Inventory['1']).to.be.equal(300);
    //       expect(warehouse.Inventory['2']).to.be.equal(300);
    //       expect(warehouse.Inventory['3']).to.be.equal(300);
    //       expect(warehouse.Inventory['4']).to.be.equal(300);
    //       expect(warehouse.Inventory['8']).to.be.equal(600);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['2']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['3']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['4']).to.be.equal(300);
    //     })

    //     it('Initial submit - order 100 of the BOGO item #1, order 200 of the BOGA item #2 + order 100 of the item #3, order 100 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
    //       const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 100
    //         },
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 100
    //         },
    //         {
    //           ItemExternalID: '2',
    //           UnitsQuantity: 200
    //         },
    //         {
    //           ItemExternalID: '3',
    //           UnitsQuantity: 100
    //         },            
    //         {
    //           ItemExternalID: '4',
    //           UnitsQuantity: 100
    //         }
    //       ])
      
    //       let warehouse = await apiClient.getWarehouse(warehouseID);
            
    //       console.log(warehouse);
    //       console.log(res);
      
    //       expect(warehouse.Inventory['1']).to.be.equal(300);
    //       expect(warehouse.Inventory['2']).to.be.equal(300);
    //       expect(warehouse.Inventory['3']).to.be.equal(300);
    //       expect(warehouse.Inventory['4']).to.be.equal(300);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(100);
    //       expect(warehouse.UserAllocations['2']).to.be.equal(100);
    //       expect(warehouse.UserAllocations['3']).to.be.equal(200);
    //       expect(warehouse.UserAllocations['4']).to.be.equal(200);
    //       expect(res.Success).to.be.true;
    //       expect(res.AllocationAvailability['1']).to.be.undefined;
    //     });

    //     it('Second submit - change+ qty - change 125 of the BOGO item #1, order 250 of the BOGA item #2 + order 150 of the item #3, order 250 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
    //       const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 125
    //         },
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 125
    //         },
    //         {
    //           ItemExternalID: '2',
    //           UnitsQuantity: 250
    //         },
    //         {
    //           ItemExternalID: '3',
    //           UnitsQuantity: 150
    //         },            
    //         {
    //           ItemExternalID: '4',
    //           UnitsQuantity: 250
    //         }
    //       ])
      
    //       let warehouse = await apiClient.getWarehouse(warehouseID);
            
    //       console.log(warehouse);
    //       console.log(res);
      
    //       expect(warehouse.Inventory['1']).to.be.equal(300);
    //       expect(warehouse.Inventory['2']).to.be.equal(300);
    //       expect(warehouse.Inventory['3']).to.be.equal(300);
    //       expect(warehouse.Inventory['4']).to.be.equal(300);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(50);
    //       expect(warehouse.UserAllocations['2']).to.be.equal(50);
    //       expect(warehouse.UserAllocations['3']).to.be.equal(150);
    //       expect(warehouse.UserAllocations['4']).to.be.equal(50);
    //       expect(res.Success).to.be.true;
    //       expect(res.AllocationAvailability['1']).to.be.undefined;
    //     });

    //     it('Third submit - change- qty - change 50 of the BOGO item #1, order 100 of the BOGA item #2 + order 50 of the item #3, order 25 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
    //       const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 50
    //         },
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 50
    //         },
    //         {
    //           ItemExternalID: '2',
    //           UnitsQuantity: 100
    //         },
    //         {
    //           ItemExternalID: '3',
    //           UnitsQuantity: 50
    //         },            
    //         {
    //           ItemExternalID: '4',
    //           UnitsQuantity: 25
    //         }
    //       ])
      
    //       let warehouse = await apiClient.getWarehouse(warehouseID);
            
    //       console.log(warehouse);
    //       console.log(res);
      
    //       expect(warehouse.Inventory['1']).to.be.equal(300);
    //       expect(warehouse.Inventory['2']).to.be.equal(300);
    //       expect(warehouse.Inventory['3']).to.be.equal(300);
    //       expect(warehouse.Inventory['4']).to.be.equal(300);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(200);
    //       expect(warehouse.UserAllocations['2']).to.be.equal(200);
    //       expect(warehouse.UserAllocations['3']).to.be.equal(250);
    //       expect(warehouse.UserAllocations['4']).to.be.equal(275);
    //       expect(res.Success).to.be.true;
    //       expect(res.AllocationAvailability['1']).to.be.undefined;
    //     });

    //   })

    //   describe("41 case - cancel - with sufficient qty", async () => {
    //     const warehouseID = uuid();
    //     const orderID = uuid();
    //     const user = uuid();
    //     var itemsQty = 10;
    //     var items: {[k: string]: any} = {};

    //     it('Rebase warehouse', async () => {
    //       for (var i = 1; i <= itemsQty; i++) {
    //         var str = i.toString();
    //         items[str] = 600;
    //       }
    
    //       await apiClient.rebase(warehouseID, items);
      
    //       const warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
      
    //       expect(warehouse.Inventory['1']).to.be.equal(600);
    //       expect(warehouse.Inventory['2']).to.be.equal(600);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations).to.be.empty;
    //     });

    //     it('Allocate user', async () => {
    //       await apiClient.createUserAllocation(warehouseID, user, '1', 300, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, user, '2', 300, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, user, '3', 300, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, user, '4', 300, yesterday(), tomorrow());
    //     });

    //     it('Force reset allocaitons', () => apiClient.forceResetAllocations());

    //     it('Check the the warehouse', async () => {
    //       const warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
    
    //       expect(warehouse.Inventory['1']).to.be.equal(300);
    //       expect(warehouse.Inventory['2']).to.be.equal(300);
    //       expect(warehouse.Inventory['3']).to.be.equal(300);
    //       expect(warehouse.Inventory['4']).to.be.equal(300);
    //       expect(warehouse.Inventory['8']).to.be.equal(600);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['2']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['3']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['4']).to.be.equal(300);
    //     })

    //     it('Initial submit - order 100 of the BOGO item #1, order 200 of the BOGA item #2 + order 100 of the item #3, order 100 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
    //       const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 100
    //         },
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 100
    //         },
    //         {
    //           ItemExternalID: '2',
    //           UnitsQuantity: 200
    //         },
    //         {
    //           ItemExternalID: '3',
    //           UnitsQuantity: 100
    //         },            
    //         {
    //           ItemExternalID: '4',
    //           UnitsQuantity: 100
    //         }
    //       ])
      
    //       let warehouse = await apiClient.getWarehouse(warehouseID);
            
    //       console.log(warehouse);
    //       console.log(res);
      
    //       expect(warehouse.Inventory['1']).to.be.equal(300);
    //       expect(warehouse.Inventory['2']).to.be.equal(300);
    //       expect(warehouse.Inventory['3']).to.be.equal(300);
    //       expect(warehouse.Inventory['4']).to.be.equal(300);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(100);
    //       expect(warehouse.UserAllocations['2']).to.be.equal(100);
    //       expect(warehouse.UserAllocations['3']).to.be.equal(200);
    //       expect(warehouse.UserAllocations['4']).to.be.equal(200);
    //       expect(res.Success).to.be.true;
    //       expect(res.AllocationAvailability['1']).to.be.undefined;
    //     });

    //     it('Cancel order - change to 0 all of the items - using UserAlloc and Inventory qty - should success', async () => {        
    //       const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 0
    //         },
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 0
    //         },
    //         {
    //           ItemExternalID: '2',
    //           UnitsQuantity: 0
    //         },
    //         {
    //           ItemExternalID: '3',
    //           UnitsQuantity: 0
    //         },            
    //         {
    //           ItemExternalID: '4',
    //           UnitsQuantity: 0
    //         }
    //       ])
      
    //       let warehouse = await apiClient.getWarehouse(warehouseID);
            
    //       console.log(warehouse);
    //       console.log(res);
      
    //       expect(warehouse.Inventory['1']).to.be.equal(300);
    //       expect(warehouse.Inventory['2']).to.be.equal(300);
    //       expect(warehouse.Inventory['3']).to.be.equal(300);
    //       expect(warehouse.Inventory['4']).to.be.equal(300);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['2']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['3']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['4']).to.be.equal(300);
    //       expect(res.Success).to.be.true;
    //       expect(res.AllocationAvailability['1']).to.be.undefined;
    //     });

    //   })

    //   describe("42 case - basic - with insufficient qty", async () => {
    //     const warehouseID = uuid();
    //     const orderID = uuid();
    //     const user = uuid();
    //     var itemsQty = 10;
    //     var items: {[k: string]: any} = {};

    //     it('Rebase warehouse', async () => {
    //       for (var i = 1; i <= itemsQty; i++) {
    //         var str = i.toString();
    //         items[str] = 600;
    //       }
    
    //       await apiClient.rebase(warehouseID, items);
      
    //       const warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
      
    //       expect(warehouse.Inventory['1']).to.be.equal(600);
    //       expect(warehouse.Inventory['2']).to.be.equal(600);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations).to.be.empty;
    //     });

    //     it('Allocate user', async () => {
    //       await apiClient.createUserAllocation(warehouseID, user, '1', 300, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, user, '2', 300, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, user, '3', 300, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, user, '4', 300, yesterday(), tomorrow());
    //     });

    //     it('Force reset allocaitons', () => apiClient.forceResetAllocations());

    //     it('Check the the warehouse', async () => {
    //       const warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
    
    //       expect(warehouse.Inventory['1']).to.be.equal(300);
    //       expect(warehouse.Inventory['2']).to.be.equal(300);
    //       expect(warehouse.Inventory['3']).to.be.equal(300);
    //       expect(warehouse.Inventory['4']).to.be.equal(300);
    //       expect(warehouse.Inventory['8']).to.be.equal(600);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['2']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['3']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['4']).to.be.equal(300);
    //     })

    //     it('Initial submit - order 500 of the BOGO item #1, order 600 of the BOGA item #2 + order 900 of the item #3, order 800 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
    //       const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 500
    //         },
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 500
    //         },
    //         {
    //           ItemExternalID: '2',
    //           UnitsQuantity: 620
    //         },
    //         {
    //           ItemExternalID: '3',
    //           UnitsQuantity: 900
    //         },            
    //         {
    //           ItemExternalID: '4',
    //           UnitsQuantity: 800
    //         }
    //       ])
      
    //       let warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
    //       console.log(res);
      
    //       expect(warehouse.Inventory['1']).to.be.equal(0);
    //       expect(warehouse.Inventory['2']).to.be.equal(0);
    //       expect(warehouse.Inventory['3']).to.be.equal(0);
    //       expect(warehouse.Inventory['4']).to.be.equal(0);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations['1']).to.be.undefined;
    //       expect(warehouse.UserAllocations['2']).to.be.undefined;
    //       expect(warehouse.UserAllocations['3']).to.be.undefined;
    //       expect(warehouse.UserAllocations['4']).to.be.undefined;
    //       expect(res.Success).to.be.false;
    //       expect(res.AllocationAvailability['1']).to.be.equal(600);
    //       expect(res.AllocationAvailability['2']).to.be.equal(600);
    //       expect(res.AllocationAvailability['3']).to.be.equal(600);
    //       expect(res.AllocationAvailability['4']).to.be.equal(600);
    //     });
    //   })

    //   describe("43 case - modification qty  - with insufficient qty", async () => {
    //     const warehouseID = uuid();
    //     const orderID = uuid();
    //     const user = uuid();
    //     var itemsQty = 10;
    //     var items: {[k: string]: any} = {};

    //     it('Rebase warehouse', async () => {
    //       for (var i = 1; i <= itemsQty; i++) {
    //         var str = i.toString();
    //         items[str] = 600;
    //       }
    
    //       await apiClient.rebase(warehouseID, items);
      
    //       const warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
      
    //       expect(warehouse.Inventory['1']).to.be.equal(600);
    //       expect(warehouse.Inventory['2']).to.be.equal(600);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations).to.be.empty;
    //     });

    //     it('Allocate user', async () => {
    //       await apiClient.createUserAllocation(warehouseID, user, '1', 300, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, user, '2', 300, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, user, '3', 300, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, user, '4', 300, yesterday(), tomorrow());
    //     });

    //     it('Force reset allocaitons', () => apiClient.forceResetAllocations());

    //     it('Check the the warehouse', async () => {
    //       const warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
    
    //       expect(warehouse.Inventory['1']).to.be.equal(300);
    //       expect(warehouse.Inventory['2']).to.be.equal(300);
    //       expect(warehouse.Inventory['3']).to.be.equal(300);
    //       expect(warehouse.Inventory['4']).to.be.equal(300);
    //       expect(warehouse.Inventory['8']).to.be.equal(600);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['2']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['3']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['4']).to.be.equal(300);
    //     })

    //     it('Initial submit - order 100 of the BOGO item #1, order 200 of the BOGA item #2 + order 100 of the item #3, order 100 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
    //       const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 100
    //         },
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 100
    //         },
    //         {
    //           ItemExternalID: '2',
    //           UnitsQuantity: 200
    //         },
    //         {
    //           ItemExternalID: '3',
    //           UnitsQuantity: 100
    //         },            
    //         {
    //           ItemExternalID: '4',
    //           UnitsQuantity: 100
    //         }
    //       ])
      
    //       let warehouse = await apiClient.getWarehouse(warehouseID);
            
    //       console.log(warehouse);
    //       console.log(res);
      
    //       expect(warehouse.Inventory['1']).to.be.equal(300);
    //       expect(warehouse.Inventory['2']).to.be.equal(300);
    //       expect(warehouse.Inventory['3']).to.be.equal(300);
    //       expect(warehouse.Inventory['4']).to.be.equal(300);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(100);
    //       expect(warehouse.UserAllocations['2']).to.be.equal(100);
    //       expect(warehouse.UserAllocations['3']).to.be.equal(200);
    //       expect(warehouse.UserAllocations['4']).to.be.equal(200);
    //       expect(res.Success).to.be.true;
    //       expect(res.AllocationAvailability['1']).to.be.undefined;
    //     });

    //     it('Second submit - change+ qty - change 125 of the BOGO item #1, order 250 of the BOGA item #2 + order 150 of the item #3, order 250 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
    //       const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 125
    //         },
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 125
    //         },
    //         {
    //           ItemExternalID: '2',
    //           UnitsQuantity: 250
    //         },
    //         {
    //           ItemExternalID: '3',
    //           UnitsQuantity: 150
    //         },            
    //         {
    //           ItemExternalID: '4',
    //           UnitsQuantity: 250
    //         }
    //       ])
      
    //       let warehouse = await apiClient.getWarehouse(warehouseID);
            
    //       console.log(warehouse);
    //       console.log(res);
      
    //       expect(warehouse.Inventory['1']).to.be.equal(300);
    //       expect(warehouse.Inventory['2']).to.be.equal(300);
    //       expect(warehouse.Inventory['3']).to.be.equal(300);
    //       expect(warehouse.Inventory['4']).to.be.equal(300);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(50);
    //       expect(warehouse.UserAllocations['2']).to.be.equal(50);
    //       expect(warehouse.UserAllocations['3']).to.be.equal(150);
    //       expect(warehouse.UserAllocations['4']).to.be.equal(50);
    //       expect(res.Success).to.be.true;
    //       expect(res.AllocationAvailability['1']).to.be.undefined;
    //     });

    //     it('Third submit - change- qty - change 50 of the BOGO item #1, order 100 of the BOGA item #2 + order 50 of the item #3, order 25 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
    //       const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 50
    //         },
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 50
    //         },
    //         {
    //           ItemExternalID: '2',
    //           UnitsQuantity: 100
    //         },
    //         {
    //           ItemExternalID: '3',
    //           UnitsQuantity: 50
    //         },            
    //         {
    //           ItemExternalID: '4',
    //           UnitsQuantity: 25
    //         }
    //       ])
      
    //       let warehouse = await apiClient.getWarehouse(warehouseID);
            
    //       console.log(warehouse);
    //       console.log(res);
      
    //       expect(warehouse.Inventory['1']).to.be.equal(300);
    //       expect(warehouse.Inventory['2']).to.be.equal(300);
    //       expect(warehouse.Inventory['3']).to.be.equal(300);
    //       expect(warehouse.Inventory['4']).to.be.equal(300);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(200);
    //       expect(warehouse.UserAllocations['2']).to.be.equal(200);
    //       expect(warehouse.UserAllocations['3']).to.be.equal(250);
    //       expect(warehouse.UserAllocations['4']).to.be.equal(275);
    //       expect(res.Success).to.be.true;
    //       expect(res.AllocationAvailability['1']).to.be.undefined;
    //     });

    //   })

    //   describe("44 case - cancel - with insufficient qty", async () => {
    //     const warehouseID = uuid();
    //     const orderID = uuid();
    //     const user = uuid();
    //     var itemsQty = 10;
    //     var items: {[k: string]: any} = {};

    //     it('Rebase warehouse', async () => {
    //       for (var i = 1; i <= itemsQty; i++) {
    //         var str = i.toString();
    //         items[str] = 600;
    //       }
    
    //       await apiClient.rebase(warehouseID, items);
      
    //       const warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
      
    //       expect(warehouse.Inventory['1']).to.be.equal(600);
    //       expect(warehouse.Inventory['2']).to.be.equal(600);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations).to.be.empty;
    //     });

    //     it('Allocate user', async () => {
    //       await apiClient.createUserAllocation(warehouseID, user, '1', 300, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, user, '2', 300, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, user, '3', 300, yesterday(), tomorrow());
    //       await apiClient.createUserAllocation(warehouseID, user, '4', 300, yesterday(), tomorrow());
    //     });

    //     it('Force reset allocaitons', () => apiClient.forceResetAllocations());

    //     it('Check the the warehouse', async () => {
    //       const warehouse = await apiClient.getWarehouse(warehouseID);
    //       console.log(warehouse);
    
    //       expect(warehouse.Inventory['1']).to.be.equal(300);
    //       expect(warehouse.Inventory['2']).to.be.equal(300);
    //       expect(warehouse.Inventory['3']).to.be.equal(300);
    //       expect(warehouse.Inventory['4']).to.be.equal(300);
    //       expect(warehouse.Inventory['8']).to.be.equal(600);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['2']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['3']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['4']).to.be.equal(300);
    //     })

    //     it('Initial submit - order 100 of the BOGO item #1, order 200 of the BOGA item #2 + order 100 of the item #3, order 100 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
    //       const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 100
    //         },
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 100
    //         },
    //         {
    //           ItemExternalID: '2',
    //           UnitsQuantity: 200
    //         },
    //         {
    //           ItemExternalID: '3',
    //           UnitsQuantity: 100
    //         },            
    //         {
    //           ItemExternalID: '4',
    //           UnitsQuantity: 100
    //         }
    //       ])
      
    //       let warehouse = await apiClient.getWarehouse(warehouseID);
            
    //       console.log(warehouse);
    //       console.log(res);
      
    //       expect(warehouse.Inventory['1']).to.be.equal(300);
    //       expect(warehouse.Inventory['2']).to.be.equal(300);
    //       expect(warehouse.Inventory['3']).to.be.equal(300);
    //       expect(warehouse.Inventory['4']).to.be.equal(300);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(100);
    //       expect(warehouse.UserAllocations['2']).to.be.equal(100);
    //       expect(warehouse.UserAllocations['3']).to.be.equal(200);
    //       expect(warehouse.UserAllocations['4']).to.be.equal(200);
    //       expect(res.Success).to.be.true;
    //       expect(res.AllocationAvailability['1']).to.be.undefined;
    //     });

    //     it('Cancel order - change to 0 all of the items - using UserAlloc and Inventory qty - should success', async () => {        
    //       const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 0
    //         },
    //         {
    //           ItemExternalID: '1',
    //           UnitsQuantity: 0
    //         },
    //         {
    //           ItemExternalID: '2',
    //           UnitsQuantity: 0
    //         },
    //         {
    //           ItemExternalID: '3',
    //           UnitsQuantity: 0
    //         },            
    //         {
    //           ItemExternalID: '4',
    //           UnitsQuantity: 0
    //         }
    //       ])
      
    //       let warehouse = await apiClient.getWarehouse(warehouseID);
            
    //       console.log(warehouse);
    //       console.log(res);
      
    //       expect(warehouse.Inventory['1']).to.be.equal(300);
    //       expect(warehouse.Inventory['2']).to.be.equal(300);
    //       expect(warehouse.Inventory['3']).to.be.equal(300);
    //       expect(warehouse.Inventory['4']).to.be.equal(300);
    //       expect(warehouse.Inventory['9']).to.be.equal(600);
    //       expect(warehouse.Inventory['10']).to.be.equal(600);
    //       expect(warehouse.UserAllocations['1']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['2']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['3']).to.be.equal(300);
    //       expect(warehouse.UserAllocations['4']).to.be.equal(300);
    //       expect(res.Success).to.be.true;
    //       expect(res.AllocationAvailability['1']).to.be.undefined;
    //     });

    //   })
    // });  
})


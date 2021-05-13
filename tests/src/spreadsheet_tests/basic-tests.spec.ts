import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("Basic tests from spreadsheet", () => {
    before(() => apiClient.install());

    after(() => apiClient.uninstall());

    describe("Basic tests from spreadsheet with one user", () => {
      describe("15 case - cancel order(s) with sufficient qty", async () => {
        const warehouseID = uuid();
        const orderID = uuid();
        const user = uuid();
        var itemsQty = 10;
        var items: {[k: string]: any} = {};
  
        it('Rebase warehouse', async () => {
          for (var i = 1; i <= itemsQty; i++) {
            var str = i.toString();
            items[str] = 100;
          }
    
          await apiClient.rebase(warehouseID, items);
      
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
      
          expect(warehouse.Inventory['1']).to.be.equal(100);
          expect(warehouse.Inventory['2']).to.be.equal(100);
          expect(warehouse.Inventory['9']).to.be.equal(100);
          expect(warehouse.Inventory['10']).to.be.equal(100);
          expect(warehouse.UserAllocations).to.be.empty;
        });
  
        it('Initial submit - order 50 of the item #1 and 60 of the item #2 - both should success', async () => {        
          const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 50
            },
            {
              ItemExternalID: '2',
              UnitsQuantity: 60
            }
          ])
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log(res);
      
          expect(warehouse.Inventory['1']).to.be.equal(50);
          expect(warehouse.Inventory['2']).to.be.equal(40);
          expect(res.Success).to.be.true;
          expect(res.AllocationAvailability['1']).to.be.undefined;
          expect(res.AllocationAvailability['2']).to.be.undefined;
        });
  
        it('Cancel - return 50 of the item #1 and 60 of the item #2 and Inventory Qty should return - both should success', async () => {        
          const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 0
            },
            {
              ItemExternalID: '2',
              UnitsQuantity: 0
            }
          ])
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log(res);
      
          expect(warehouse.Inventory['1']).to.be.equal(100);
          expect(warehouse.Inventory['2']).to.be.equal(100);
          expect(res.Success).to.be.true;
          expect(res.AllocationAvailability['1']).to.be.undefined;
        });
      })
  
      describe("16 case - cancel order(s) with insufficient qty", async () => {
        const warehouseID = uuid();
        const orderID = uuid();
        const user = uuid();
        var itemsQty = 10;
        var items: {[k: string]: any} = {};
  
        it('Rebase warehouse', async () => {
          for (var i = 1; i <= itemsQty; i++) {
            var str = i.toString();
            items[str] = 100;
          }
    
          await apiClient.rebase(warehouseID, items);
      
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
      
          expect(warehouse.Inventory['1']).to.be.equal(100);
          expect(warehouse.Inventory['2']).to.be.equal(100);
          expect(warehouse.Inventory['9']).to.be.equal(100);
          expect(warehouse.Inventory['10']).to.be.equal(100);
          expect(warehouse.UserAllocations).to.be.empty;
        });
  
        it('Initial submit - order 150 of the item #1 and 160 of the item #2 - both should be moved to TempAlloc - should success', async () => {        
          const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 150
            },
            {
              ItemExternalID: '2',
              UnitsQuantity: 160
            }
          ])
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log(res);
      
          expect(warehouse.Inventory['1']).to.be.equal(0);
          expect(warehouse.Inventory['2']).to.be.equal(0);
          expect(res.Success).to.be.false;
          expect(res.AllocationAvailability['1']).to.be.equal(100);
          expect(res.AllocationAvailability['2']).to.be.equal(100);
        });
  
        it('Cancel - return 100 of the item #1 and 100 of the item #2 from TempAlloc and Inventory Qty should return - both should success', async () => {        
          const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 0
            },
            {
              ItemExternalID: '2',
              UnitsQuantity: 0
            }
          ])
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log("Res - ", res);
      
          expect(warehouse.Inventory['1']).to.be.equal(100);
          expect(warehouse.Inventory['2']).to.be.equal(100);
          expect(res.Success).to.be.true;
          expect(res.AllocationAvailability['1']).to.be.undefined;
        });
      })
  
      describe("17 case - Modification qty in already submitted orders - with sufficient qty", async () => {
        const warehouseID = uuid();
        const orderID = uuid();
        const user = uuid();
        var itemsQty = 10;
        var items: {[k: string]: any} = {};
  
        it('Rebase warehouse', async () => {
          for (var i = 1; i <= itemsQty; i++) {
            var str = i.toString();
            items[str] = 100;
          }
    
          await apiClient.rebase(warehouseID, items);
      
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
      
          expect(warehouse.Inventory['1']).to.be.equal(100);
          expect(warehouse.Inventory['2']).to.be.equal(100);
          expect(warehouse.Inventory['9']).to.be.equal(100);
          expect(warehouse.Inventory['10']).to.be.equal(100);
          expect(warehouse.UserAllocations).to.be.empty;
        });
  
        
        it('Initial submit - order 40 of the item #1 and 60 of the item #2 - should success', async () => {        
          const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 40
            },
            {
              ItemExternalID: '2',
              UnitsQuantity: 60
            }
          ])
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log("Res - ", res);
      
          expect(warehouse.Inventory['1']).to.be.equal(60);
          expect(warehouse.Inventory['2']).to.be.equal(40);
          expect(res.Success).to.be.true;
          expect(res.AllocationAvailability['1']).to.be.undefined;
          expect(res.AllocationAvailability['2']).to.be.undefined;
        });
  
        it('Second submit - change qty to 80 of the item #1 and 90 of the item #2 - should success', async () => {        
          const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 80
            },
            {
              ItemExternalID: '2',
              UnitsQuantity: 90
            }
          ])
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log(res);
      
          expect(warehouse.Inventory['1']).to.be.equal(20);
          expect(warehouse.Inventory['2']).to.be.equal(10);
          expect(res.Success).to.be.true;
          expect(res.AllocationAvailability['1']).to.be.undefined;
        });
  
        it('Third submit - change qty to 20 of the item #1 and 30 of the item #2 - should success', async () => {        
          const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 20
            },
            {
              ItemExternalID: '2',
              UnitsQuantity: 30
            }
          ])
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log(res);
      
          expect(warehouse.Inventory['1']).to.be.equal(80);
          expect(warehouse.Inventory['2']).to.be.equal(70);
          expect(res.Success).to.be.true;
          expect(res.AllocationAvailability['1']).to.be.undefined;
        });
  
        it('Forth submit - cancel - change qty to 0 of the item #1 and 0 of the item #2 - should success', async () => {        
          const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 0
            },
            {
              ItemExternalID: '2',
              UnitsQuantity: 0
            }
          ])
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log(res);
      
          expect(warehouse.Inventory['1']).to.be.equal(100);
          expect(warehouse.Inventory['2']).to.be.equal(100);
          expect(res.Success).to.be.true;
          expect(res.AllocationAvailability['1']).to.be.undefined;
        });
      })
  
      describe("18 case - Modification qty in already submitted orders - with insufficient qty", async () => {
        const warehouseID = uuid();
        const orderID = uuid();
        const user = uuid();
        var itemsQty = 10;
        var items: {[k: string]: any} = {};
  
        it('Rebase warehouse', async () => {
          for (var i = 1; i <= itemsQty; i++) {
            var str = i.toString();
            items[str] = 100;
          }
    
          await apiClient.rebase(warehouseID, items);
      
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
      
          expect(warehouse.Inventory['1']).to.be.equal(100);
          expect(warehouse.Inventory['2']).to.be.equal(100);
          expect(warehouse.Inventory['9']).to.be.equal(100);
          expect(warehouse.Inventory['10']).to.be.equal(100);
          expect(warehouse.UserAllocations).to.be.empty;
        });
  
        
        it('Initial submit - order 40 of the item #1 and 60 of the item #2 - should success', async () => {        
          const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 40
            },
            {
              ItemExternalID: '2',
              UnitsQuantity: 60
            }
          ])
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log("Res - ", res);
      
          expect(warehouse.Inventory['1']).to.be.equal(60);
          expect(warehouse.Inventory['2']).to.be.equal(40);
          expect(warehouse.Inventory['9']).to.be.equal(100);
          expect(warehouse.Inventory['10']).to.be.equal(100);
          expect(res.Success).to.be.true;
          expect(res.AllocationAvailability['1']).to.be.undefined;
          expect(res.AllocationAvailability['2']).to.be.undefined;
        });
  
        it('Second submit - change qty to 120 of the item #1 and 140 of the item #2 - Inventory is 0 - should success', async () => {        
          const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 120
            },
            {
              ItemExternalID: '2',
              UnitsQuantity: 140
            }
          ])
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log(res);
      
          expect(warehouse.Inventory['1']).to.be.equal(0);
          expect(warehouse.Inventory['2']).to.be.equal(0);
          expect(warehouse.Inventory['9']).to.be.equal(100);
          expect(warehouse.Inventory['10']).to.be.equal(100);
          expect(res.Success).to.be.false;
          expect(res.AllocationAvailability['1']).to.be.equal(100);
          expect(res.AllocationAvailability['2']).to.be.equal(100);
        });
  
        it('Third submit - change qty to 80 of the item #1 and 90 of the item #2 - should success', async () => {        
          const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 80
            },
            {
              ItemExternalID: '2',
              UnitsQuantity: 90
            }
          ])
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log(res);
      
          expect(warehouse.Inventory['1']).to.be.equal(20);
          expect(warehouse.Inventory['2']).to.be.equal(10);
          expect(warehouse.Inventory['9']).to.be.equal(100);
          expect(warehouse.Inventory['10']).to.be.equal(100);
          expect(res.Success).to.be.true;
          expect(res.AllocationAvailability['1']).to.be.undefined;
          expect(res.AllocationAvailability['2']).to.be.undefined;
        });
      })
    });

    describe("Basic tests from spreadsheet with multiple users", () => {
      describe("15 case - cancel order(s) with sufficient qty", async () => {
        const warehouseID = uuid();
        const user = uuid();
        var ordersQty = 30;
        var orders: string[] = [];
        var initialOrders: string[] = [];
        var itemsQty = 10;
        var items: {[k: string]: any} = {};
  
        it('Rebase warehouse', async () => {
          for (var i = 1; i <= itemsQty; i++) {
            var str = i.toString();
            items[str] = 10000;
          }
    
          await apiClient.rebase(warehouseID, items);
      
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
      
          expect(warehouse.Inventory['1']).to.be.equal(10000);
          expect(warehouse.Inventory['2']).to.be.equal(10000);
          expect(warehouse.Inventory['9']).to.be.equal(10000);
          expect(warehouse.Inventory['10']).to.be.equal(10000);
          expect(warehouse.UserAllocations).to.be.empty;
        });
  
        it(`Initial submit - order 50 of the item #1 and 60 of the item #2 with ${ordersQty} - both should success`, async () => {   
          var successOrders = 0;
          var failOrders = 0;
          var userId = 0;

          for (var i = 0; i < ordersQty; i++) {
            var order = uuid();
            orders.push(order)
          }
  
          await Promise.all(orders.map(order => (async () => {
            try {
              await apiClient.allocatedOrder(warehouseID, order, `${user}-${userId}`, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: 50
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: 60
                }
              ])
              successOrders++;
              initialOrders.push(order);
              userId++;
            } catch (error) {
              failOrders++;
              userId++;
            }
          })()))
                
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.equal(10000 - (successOrders * 50));
          expect(warehouse.Inventory['2']).to.be.equal(10000 - (successOrders * 60));
          expect(successOrders + failOrders).to.be.equal(ordersQty);
        });
  
        it('Cancel - return 50 of the item #1 and 60 of the item #2 and Inventory Qty should return - both should success', async () => {        
          var successOrders = 0;
          var failOrders = 0;
          var userId = 0;
        
          await Promise.all(initialOrders.map(order => (async () => {
            try {
              await apiClient.allocatedOrder(warehouseID, order, ``, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: 0
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: 0
                }
              ])
              successOrders++;
              userId++;
            } catch (error) {
              failOrders++;
              userId++;
            }
          })()))
                
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.equal(10000);
          expect(warehouse.Inventory['2']).to.be.equal(10000);
          expect(successOrders + failOrders).to.be.equal(initialOrders.length);
        });
      })
  
      describe("16 case - cancel order(s) with insufficient qty", async () => {
        const warehouseID = uuid();
        const user = uuid();
        var ordersQty = 30;
        var orders: string[] = [];
        var initialOrders: string[] = [];
        var itemsQty = 10;
        var items: {[k: string]: any} = {};
  
        it('Rebase warehouse', async () => {
          for (var i = 1; i <= itemsQty; i++) {
            var str = i.toString();
            items[str] = 10000;
          }
    
          await apiClient.rebase(warehouseID, items);
      
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
      
          expect(warehouse.Inventory['1']).to.be.equal(10000);
          expect(warehouse.Inventory['2']).to.be.equal(10000);
          expect(warehouse.Inventory['9']).to.be.equal(10000);
          expect(warehouse.Inventory['10']).to.be.equal(10000);
          expect(warehouse.UserAllocations).to.be.empty;
        });

        it(`Initial submit - order 150 of the item #1 and 160 of the item #2 with ${ordersQty} orders - should be moved to TempAlloc - should success`, async () => {   
          var successOrders = 0;
          var failOrders = 0;
          var userId = 0;

          for (var i = 0; i < ordersQty; i++) {
            var order = uuid();
            orders.push(order)
          }
  
          await Promise.all(orders.map(order => (async () => {
            try {
              await apiClient.allocatedOrder(warehouseID, order, `${user}-${userId}`, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: 150
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: 160
                }
              ])
              successOrders++;
              initialOrders.push(order);
              userId++;
            } catch (error) {
              failOrders++;
              userId++;
            }
          })()))
                
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.equal(10000 - (successOrders * 150));
          expect(warehouse.Inventory['2']).to.be.equal(10000 - (successOrders * 160));
          expect(successOrders + failOrders).to.be.equal(ordersQty);
        });
    
        it('Cancel - return 100 of the item #1 and 100 of the item #2 from TempAlloc and Inventory Qty should return - both should success', async () => {        
          var successOrders = 0;
          var failOrders = 0;
          var userId = 0;

          await Promise.all(initialOrders.map(order => (async () => {
            try {
              await apiClient.allocatedOrder(warehouseID, order, ``, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: 0
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: 0
                }
              ])
              successOrders++;
              userId++;
            } catch (error) {
              failOrders++;
              userId++;
            }
          })()))
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.equal(10000);
          expect(warehouse.Inventory['2']).to.be.equal(10000);
          expect(successOrders + failOrders).to.be.equal(initialOrders.length);
        });
      })
  
      describe("17 case - Modification qty in already submitted orders - with sufficient qty", async () => {
        const warehouseID = uuid();
        const user = uuid();
        var ordersQty = 20;
        var orders: string[] = [];
        var initialOrders: string[] = [];
        var afterFirstChange: string[] = [];
        var afterSecondChange: string[] = [];
        var itemsQty = 10;
        var items: {[k: string]: any} = {};
  
        it('Rebase warehouse', async () => {
          for (var i = 1; i <= itemsQty; i++) {
            var str = i.toString();
            items[str] = 10000;
          }
    
          await apiClient.rebase(warehouseID, items);
      
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
      
          expect(warehouse.Inventory['1']).to.be.equal(10000);
          expect(warehouse.Inventory['2']).to.be.equal(10000);
          expect(warehouse.Inventory['9']).to.be.equal(10000);
          expect(warehouse.Inventory['10']).to.be.equal(10000);
          expect(warehouse.UserAllocations).to.be.empty;
        });

        it(`Initial submit - order a few items with ${ordersQty} - both should success`, async () => {   
          var successOrders = 0;
          var failOrders = 0;
          var userId = 0;

          for (var i = 0; i < ordersQty; i++) {
            var order = uuid();
            orders.push(order)
          }
  
          await Promise.all(orders.map(order => (async () => {
            try {
              await apiClient.allocatedOrder(warehouseID, order, `${userId}`, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: 50
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: 50
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: 50
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: 50
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: 50
                },
                {
                  ItemExternalID: '6',
                  UnitsQuantity: 100
                },
                {
                  ItemExternalID: '7',
                  UnitsQuantity: 100
                },
                {
                  ItemExternalID: '8',
                  UnitsQuantity: 100
                },
                {
                  ItemExternalID: '9',
                  UnitsQuantity: 100
                }
              ])
              successOrders++;
              initialOrders.push(`${order}/${userId}`);
              userId++;
            } catch (error) {
              failOrders++;
              userId++;
            }
          })()))
                
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.equal(10000 - (successOrders * 50));
          expect(warehouse.Inventory['2']).to.be.equal(10000 - (successOrders * 50));
          expect(warehouse.Inventory['3']).to.be.equal(10000 - (successOrders * 50));
          expect(warehouse.Inventory['4']).to.be.equal(10000 - (successOrders * 50));
          expect(warehouse.Inventory['5']).to.be.equal(10000 - (successOrders * 50));
          expect(warehouse.Inventory['6']).to.be.equal(10000 - (successOrders * 100));
          expect(warehouse.Inventory['7']).to.be.equal(10000 - (successOrders * 100));
          expect(warehouse.Inventory['8']).to.be.equal(10000 - (successOrders * 100));
          expect(warehouse.Inventory['9']).to.be.equal(10000 - (successOrders * 100));
          expect(successOrders + failOrders).to.be.equal(ordersQty);
        });
  
  
        it(`Second submit - change (+) items qty with success orders - should success`, async () => {        
          var successOrders = 0;
          var failOrders = 0;

          await Promise.all(initialOrders.map(orderUser => (async () => {
            var orderUserSplited = orderUser.split('/');
            var order = orderUserSplited[0]
            var user = orderUserSplited[1];
            try {
              await apiClient.allocatedOrder(warehouseID, order, user, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: 150
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: 150
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: 150
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: 150
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: 150
                },
                {
                  ItemExternalID: '6',
                  UnitsQuantity: 200
                },
                {
                  ItemExternalID: '7',
                  UnitsQuantity: 200
                },
                {
                  ItemExternalID: '8',
                  UnitsQuantity: 200
                },
                {
                  ItemExternalID: '9',
                  UnitsQuantity: 200
                }
              ])
              successOrders++;
              afterFirstChange.push(`${order}/${user}`);
            } catch (error) {
              failOrders++;
            }
          })()))
                
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.equal(10000 - (successOrders * 150));
          expect(warehouse.Inventory['2']).to.be.equal(10000 - (successOrders * 150));
          expect(warehouse.Inventory['3']).to.be.equal(10000 - (successOrders * 150));
          expect(warehouse.Inventory['4']).to.be.equal(10000 - (successOrders * 150));
          expect(warehouse.Inventory['5']).to.be.equal(10000 - (successOrders * 150));
          expect(warehouse.Inventory['6']).to.be.equal(10000 - (successOrders * 200));
          expect(warehouse.Inventory['7']).to.be.equal(10000 - (successOrders * 200));
          expect(warehouse.Inventory['8']).to.be.equal(10000 - (successOrders * 200));
          expect(warehouse.Inventory['9']).to.be.equal(10000 - (successOrders * 200));
          expect(successOrders + failOrders).to.be.equal(initialOrders.length);
        });

        it(`Third submit - change (-) items qty with success orders - should success`, async () => {        
          var successOrders = 0;
          var failOrders = 0;

          await Promise.all(afterFirstChange.map(orderUser => (async () => {
            var orderUserSplited = orderUser.split('/');
            var order = orderUserSplited[0]
            var user = orderUserSplited[1];
            try {
              await apiClient.allocatedOrder(warehouseID, order, user, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: 20
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: 20
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: 20
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: 20
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: 20
                },
                {
                  ItemExternalID: '6',
                  UnitsQuantity: 50
                },
                {
                  ItemExternalID: '7',
                  UnitsQuantity: 50
                },
                {
                  ItemExternalID: '8',
                  UnitsQuantity: 50
                },
                {
                  ItemExternalID: '9',
                  UnitsQuantity: 50
                }
              ])
              successOrders++;
              afterSecondChange.push(`${order}/${user}`);
            } catch (error) {
              failOrders++;
            }
          })()))
                
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.equal(10000 - (successOrders * 20));
          expect(warehouse.Inventory['2']).to.be.equal(10000 - (successOrders * 20));
          expect(warehouse.Inventory['3']).to.be.equal(10000 - (successOrders * 20));
          expect(warehouse.Inventory['4']).to.be.equal(10000 - (successOrders * 20));
          expect(warehouse.Inventory['5']).to.be.equal(10000 - (successOrders * 20));
          expect(warehouse.Inventory['6']).to.be.equal(10000 - (successOrders * 50));
          expect(warehouse.Inventory['7']).to.be.equal(10000 - (successOrders * 50));
          expect(warehouse.Inventory['8']).to.be.equal(10000 - (successOrders * 50));
          expect(warehouse.Inventory['9']).to.be.equal(10000 - (successOrders * 50));
          expect(successOrders + failOrders).to.be.equal(afterSecondChange.length);
        });
  
        it(`Forth submit - cancel - change (0) items qty to 0 with success orders - should success`, async () => {        
          var successOrders = 0;
          var failOrders = 0;

          await Promise.all(afterSecondChange.map(orderUser => (async () => {
            var orderUserSplited = orderUser.split('/');
            var order = orderUserSplited[0]
            var user = orderUserSplited[1];
            try {
              await apiClient.allocatedOrder(warehouseID, order, user, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: 0
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: 0
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: 0
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: 0
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: 0
                },
                {
                  ItemExternalID: '6',
                  UnitsQuantity: 0
                },
                {
                  ItemExternalID: '7',
                  UnitsQuantity: 0
                },
                {
                  ItemExternalID: '8',
                  UnitsQuantity: 0
                },
                {
                  ItemExternalID: '9',
                  UnitsQuantity: 0
                }
              ])
              successOrders++;
            } catch (error) {
              failOrders++;
            }
          })()))
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.equal(10000);
          expect(warehouse.Inventory['2']).to.be.equal(10000);
          expect(warehouse.Inventory['3']).to.be.equal(10000);
          expect(warehouse.Inventory['4']).to.be.equal(10000);
          expect(warehouse.Inventory['5']).to.be.equal(10000);
          expect(warehouse.Inventory['6']).to.be.equal(10000);
          expect(warehouse.Inventory['7']).to.be.equal(10000);
          expect(warehouse.Inventory['8']).to.be.equal(10000);
          expect(warehouse.Inventory['9']).to.be.equal(10000);
          expect(successOrders + failOrders).to.be.equal(afterSecondChange.length);
        });
      })

      describe("18 case - Modification qty in already submitted orders - with insufficient qty", async () => {
        const warehouseID = uuid();
        const user = uuid();
        var ordersQty = 20;
        var orders: string[] = [];
        var initialOrders: string[] = [];
        var afterFirstChange: string[] = [];
        var afterSecondChange: string[] = [];
        var itemsQty = 10;
        var items: {[k: string]: any} = {};
  
        it('Rebase warehouse', async () => {
          for (var i = 1; i <= itemsQty; i++) {
            var str = i.toString();
            items[str] = 100;
          }
    
          await apiClient.rebase(warehouseID, items);
      
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
      
          expect(warehouse.Inventory['1']).to.be.equal(100);
          expect(warehouse.Inventory['2']).to.be.equal(100);
          expect(warehouse.Inventory['9']).to.be.equal(100);
          expect(warehouse.Inventory['10']).to.be.equal(100);
          expect(warehouse.UserAllocations).to.be.empty;
        });

        it(`Initial submit - order 20 items - should success`, async () => {   
          var successOrders = 0;
          var failOrders = 0;
          var userId = 0;

          for (var i = 0; i < ordersQty; i++) {
            var order = uuid();
            orders.push(order)
          }
  
          await Promise.all(orders.map(order => (async () => {
            try {
              await apiClient.allocatedOrder(warehouseID, order, `${userId}`, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: 40
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: 60
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: 60
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: 60
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: 60
                },
                {
                  ItemExternalID: '6',
                  UnitsQuantity: 60
                },
                {
                  ItemExternalID: '7',
                  UnitsQuantity: 60
                },
                {
                  ItemExternalID: '8',
                  UnitsQuantity: 60
                },
                {
                  ItemExternalID: '9',
                  UnitsQuantity: 60
                }
              ])
              successOrders++;
              initialOrders.push(`${order}/${userId}`);
              userId++;
            } catch (error) {
              failOrders++;
              userId++;
            }
          })()))
                
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.equal(0);
          expect(warehouse.Inventory['2']).to.be.equal(0);
          expect(warehouse.Inventory['3']).to.be.equal(0);
          expect(warehouse.Inventory['4']).to.be.equal(0);
          expect(warehouse.Inventory['5']).to.be.equal(0);
          expect(warehouse.Inventory['6']).to.be.equal(0);
          expect(warehouse.Inventory['7']).to.be.equal(0);
          expect(warehouse.Inventory['8']).to.be.equal(0);
          expect(warehouse.Inventory['9']).to.be.equal(0);
          expect(successOrders + failOrders).to.be.equal(ordersQty);
        });
  
        it(`Second submit - change (+) items qty with success orders - Inventory is 0 - should success`, async () => {        
          var successOrders = 0;
          var failOrders = 0;

          await Promise.all(initialOrders.map(orderUser => (async () => {
            var orderUserSplited = orderUser.split('/');
            var order = orderUserSplited[0]
            var user = orderUserSplited[1];
            try {
              await apiClient.allocatedOrder(warehouseID, order, user, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: 150
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: 150
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: 150
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: 150
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: 150
                },
                {
                  ItemExternalID: '6',
                  UnitsQuantity: 200
                },
                {
                  ItemExternalID: '7',
                  UnitsQuantity: 200
                },
                {
                  ItemExternalID: '8',
                  UnitsQuantity: 200
                },
                {
                  ItemExternalID: '9',
                  UnitsQuantity: 200
                }
              ])
              successOrders++;
              afterFirstChange.push(`${order}/${user}`);
            } catch (error) {
              failOrders++;
            }
          })()))
                
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.equal(0);
          expect(warehouse.Inventory['2']).to.be.equal(0);
          expect(warehouse.Inventory['3']).to.be.equal(0);
          expect(warehouse.Inventory['4']).to.be.equal(0);
          expect(warehouse.Inventory['5']).to.be.equal(0);
          expect(warehouse.Inventory['6']).to.be.equal(0);
          expect(warehouse.Inventory['7']).to.be.equal(0);
          expect(warehouse.Inventory['8']).to.be.equal(0);
          expect(warehouse.Inventory['9']).to.be.equal(0);
          expect(successOrders + failOrders).to.be.equal(initialOrders.length);
        });

        it(`Third submit - change (-) items qty with success orders - should success`, async () => {        
          var successOrders = 0;
          var failOrders = 0;

          await Promise.all(afterFirstChange.map(orderUser => (async () => {
            var orderUserSplited = orderUser.split('/');
            var order = orderUserSplited[0]
            var user = orderUserSplited[1];
            try {
              await apiClient.allocatedOrder(warehouseID, order, user, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: 110
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: 110
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: 110
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: 110
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: 110
                },
                {
                  ItemExternalID: '6',
                  UnitsQuantity: 120
                },
                {
                  ItemExternalID: '7',
                  UnitsQuantity: 120
                },
                {
                  ItemExternalID: '8',
                  UnitsQuantity: 120
                },
                {
                  ItemExternalID: '9',
                  UnitsQuantity: 120
                }
              ])
              successOrders++;
              afterSecondChange.push(`${order}/${user}`);
            } catch (error) {
              failOrders++;
            }
          })()))
                
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.equal(0);
          expect(warehouse.Inventory['2']).to.be.equal(0);
          expect(warehouse.Inventory['3']).to.be.equal(0);
          expect(warehouse.Inventory['4']).to.be.equal(0);
          expect(warehouse.Inventory['5']).to.be.equal(0);
          expect(warehouse.Inventory['6']).to.be.equal(0);
          expect(warehouse.Inventory['7']).to.be.equal(0);
          expect(warehouse.Inventory['8']).to.be.equal(0);
          expect(warehouse.Inventory['9']).to.be.equal(0);
          expect(successOrders + failOrders).to.be.equal(afterFirstChange.length);
        });
  
        it(`Forth submit - cancel - change (0) items qty to 0 with success orders - should success`, async () => {        
          var successOrders = 0;
          var failOrders = 0;

          await Promise.all(afterSecondChange.map(orderUser => (async () => {
            var orderUserSplited = orderUser.split('/');
            var order = orderUserSplited[0]
            var user = orderUserSplited[1];
            try {
              await apiClient.allocatedOrder(warehouseID, order, user, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: 0
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: 0
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: 0
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: 0
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: 0
                },
                {
                  ItemExternalID: '6',
                  UnitsQuantity: 0
                },
                {
                  ItemExternalID: '7',
                  UnitsQuantity: 0
                },
                {
                  ItemExternalID: '8',
                  UnitsQuantity: 0
                },
                {
                  ItemExternalID: '9',
                  UnitsQuantity: 0
                }
              ])
              successOrders++;
            } catch (error) {
              failOrders++;
            }
          })()))
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.equal(100);
          expect(warehouse.Inventory['2']).to.be.equal(100);
          expect(warehouse.Inventory['3']).to.be.equal(100);
          expect(warehouse.Inventory['4']).to.be.equal(100);
          expect(warehouse.Inventory['5']).to.be.equal(100);
          expect(warehouse.Inventory['6']).to.be.equal(100);
          expect(warehouse.Inventory['7']).to.be.equal(100);
          expect(warehouse.Inventory['8']).to.be.equal(100);
          expect(warehouse.Inventory['9']).to.be.equal(100);
          expect(successOrders + failOrders).to.be.equal(afterSecondChange.length);
        });
      })
    });

}); 
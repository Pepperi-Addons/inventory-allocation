import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("User-Specific tests from spreadsheet", () => {
    before(() => apiClient.install());

    after(() => apiClient.uninstall());

    describe("User-Specific tests from spreadsheet with one user", () => {
      describe("31 case - basic - with sufficient qty", async () => {
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
  
        it('Allocate user', async () => {
          await apiClient.createUserAllocation(warehouseID, user, '1', 20, yesterday(), tomorrow());
        });
  
        it('Force reset allocaitons', () => apiClient.forceResetAllocations());
  
        it('Check the the warehouse', async () => {
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
    
          expect(warehouse.Inventory['1']).to.be.equal(80);
          expect(warehouse.Inventory['2']).to.be.equal(100);
          expect(warehouse.Inventory['9']).to.be.equal(100);
          expect(warehouse.Inventory['10']).to.be.equal(100);
          expect(warehouse.UserAllocations['1']).to.be.equal(20);
        })
  
        it('Initial submit - order 50 of the item #1 using UserAlloc and Inventory qty - should success', async () => {        
          const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 50
            }
          ])
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log(res);
      
          expect(warehouse.Inventory['1']).to.be.equal(50);
          expect(warehouse.Inventory['2']).to.be.equal(100);
          expect(warehouse.UserAllocations['1']).to.be.undefined;
          expect(res.Success).to.be.true;
          expect(res.AllocationAvailability['1']).to.be.undefined;
        });
  
        it('Cancel order - change to 0 of the item #1 - Inventory qty and UserAlloc should return - should success, with uncorrect qty', async () => {        
          const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 0
            }
          ])
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log(res);
      
          expect(warehouse.Inventory['1']).to.be.equal(80);
          expect(warehouse.Inventory['2']).to.be.equal(100);
          expect(warehouse.UserAllocations['1']).to.be.equal(20);
          expect(res.Success).to.be.true;
          expect(res.AllocationAvailability['1']).to.be.undefined;
        });
  
        it('Force reset allocaitons', () => apiClient.forceResetAllocations());
  
        it('Check the the warehouse - after reset', async () => {
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
    
          expect(warehouse.Inventory['1']).to.be.equal(80);
          expect(warehouse.Inventory['2']).to.be.equal(100);
          expect(warehouse.Inventory['9']).to.be.equal(100);
          expect(warehouse.Inventory['10']).to.be.equal(100);
          expect(warehouse.UserAllocations['1']).to.be.equal(20);
        })
  
      })
  
      describe("32 case - modification qty - with insufficient qty", async () => {
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
  
        it('Allocate user', async () => {
          await apiClient.createUserAllocation(warehouseID, user, '1', 20, yesterday(), tomorrow());
        });
  
        it('Force reset allocaitons', () => apiClient.forceResetAllocations());
  
        it('Check the the warehouse', async () => {
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
    
          expect(warehouse.Inventory['1']).to.be.equal(80);
          expect(warehouse.Inventory['2']).to.be.equal(100);
          expect(warehouse.Inventory['9']).to.be.equal(100);
          expect(warehouse.Inventory['10']).to.be.equal(100);
          expect(warehouse.UserAllocations['1']).to.be.equal(20);
        })
  
        it('Initial submit - order 120 of the item #1 using UserAlloc and Inventory qty - should success', async () => {        
          const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 120
            }
          ])
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log(res);
      
          expect(warehouse.Inventory['1']).to.be.undefined;
          expect(warehouse.Inventory['2']).to.be.equal(100);
          expect(warehouse.UserAllocations['1']).to.be.undefined;
          expect(res.Success).to.be.false;
          expect(res.AllocationAvailability['1']).to.be.equal(100);
        });
  
        it('Cancel order - change to 0 of the item #1 - Inventory qty and UserAlloc should return - should success, with uncorrect qty', async () => {        
          const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 0
            }
          ])
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log(res);
      
          expect(warehouse.Inventory['1']).to.be.equal(80);
          expect(warehouse.Inventory['2']).to.be.equal(100);
          expect(warehouse.UserAllocations['1']).to.be.equal(20);
          expect(res.Success).to.be.true;
          expect(res.AllocationAvailability['1']).to.be.undefined;
        });
  
        it('Force reset allocaitons', () => apiClient.forceResetAllocations());
  
        it('Check the the warehouse - after reset', async () => {
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
    
          expect(warehouse.Inventory['1']).to.be.equal(80);
          expect(warehouse.Inventory['2']).to.be.equal(100);
          expect(warehouse.Inventory['9']).to.be.equal(100);
          expect(warehouse.Inventory['10']).to.be.equal(100);
          expect(warehouse.UserAllocations['1']).to.be.equal(20);
        })
      })
    });

    describe("User-Specific tests from spreadsheet with multiple users", () => {
      describe("31 case - basic - with sufficient qty", async () => {
        const warehouseID = uuid();
        const orderID = uuid();
        const user = uuid();
        var itemsQty = 4;
        var usersQty = 10;
        var ordersQty = itemsQty;
        var orders: string[] = [];
        var initialOrders: string[] = [];
        var items: {[k: string]: any} = {};
        var users: string[] = [];
  
        it('Rebase warehouse', async () => {
          for (var i = 1; i <= itemsQty; i++) {
            var str = i.toString();
            items[str] = 10000;
          }
    
          await apiClient.rebase(warehouseID, items);

          for (var i = 0; i < usersQty; i++) {
            var user = uuid();
            users.push(user)
          }
      
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
      
          expect(warehouse.Inventory['1']).to.be.equal(10000);
          expect(warehouse.Inventory['2']).to.be.equal(10000);
          expect(warehouse.Inventory['3']).to.be.equal(10000);
          expect(warehouse.Inventory['4']).to.be.equal(10000);
          expect(warehouse.UserAllocations).to.be.empty;
        });
  
        it('Allocate user', async () => {
          await apiClient.createUserAllocation(warehouseID, users[0], '1', 1000, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, users[0], '2', 1000, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, users[0], '3', 1000, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, users[1], '1', 1000, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, users[1], '2', 1000, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, users[1], '3', 1000, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, users[2], '1', 1000, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, users[2], '2', 1000, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, users[2], '3', 1000, yesterday(), tomorrow());
        });
  
        it('Force reset allocaitons', () => apiClient.forceResetAllocations());
  
        it('Check the the warehouse', async () => {
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
    
          expect(warehouse.Inventory['1']).to.be.equal(7000);
          expect(warehouse.Inventory['2']).to.be.equal(7000);
          expect(warehouse.Inventory['3']).to.be.equal(7000);
          expect(warehouse.UserAllocations['1']).to.be.equal(3000);
          expect(warehouse.UserAllocations['2']).to.be.equal(3000);
          expect(warehouse.UserAllocations['2']).to.be.equal(3000);
        })
  
        it('Initial submit - order a few items using UserAlloc and Inventory qty - should success', async () => {        
          var successOrders = 0;
          var failOrders = 0;
          var userID = 0;

          for (var i = 0; i < usersQty; i++) {
            var order = uuid();
            orders.push(order)
          }

          // console.log("Users", users);
          // console.log("Orders", orders);

          await Promise.all(orders.map(order => (async () => {
            var user = users[userID];
            userID++;
            try {
              await apiClient.allocatedOrder(warehouseID, order, user, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: 2000
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: 2000
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: 2000
                }
              ])
              successOrders++;
              initialOrders.push(`${order}/${user}`);
              console.log(`Success - ${order}/${user}`);
            } catch (error) {
              failOrders++;
            }
          })()))
          
          let warehouse = await apiClient.getWarehouse(warehouseID);
          // let allocation = await apiClient.getOrderAllocations();

          console.log(warehouse);
          // console.log("Allocation", allocation);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.undefined;
          expect(warehouse.Inventory['2']).to.be.undefined;
          expect(warehouse.Inventory['3']).to.be.undefined;
          expect(warehouse.UserAllocations['1']).to.be.undefined;
          expect(warehouse.UserAllocations['2']).to.be.undefined;
          expect(warehouse.UserAllocations['3']).to.be.undefined;
          expect(successOrders + failOrders).to.be.equal(usersQty);
        });

        it('Cancel order - change qty to 0  - Inventory qty and UserAlloc should return - should success, with uncorrect qty', async () => {        
          var successOrders = 0;
          var failOrders = 0;
          var userID = 0;

          await Promise.all(orders.map(order => (async () => {
            var user = users[userID];
            userID++;
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
                }
              ])
              successOrders++;
              initialOrders.push(`${order}/${user}`);
              console.log(`Success - ${order}/${user}`);
            } catch (error) {
              failOrders++;
            }
          })()))
          
          let warehouse = await apiClient.getWarehouse(warehouseID);

          console.log(warehouse);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.equal(7000);
          expect(warehouse.Inventory['2']).to.be.equal(7000);
          expect(warehouse.Inventory['3']).to.be.equal(7000);
          expect(warehouse.Inventory['4']).to.be.equal(10000);
          expect(warehouse.UserAllocations['1']).to.be.equal(3000);
          expect(warehouse.UserAllocations['2']).to.be.equal(3000);
          expect(warehouse.UserAllocations['3']).to.be.equal(3000);
          expect(successOrders + failOrders).to.be.equal(usersQty);
        });
  
        it('Force reset allocaitons', () => apiClient.forceResetAllocations());
  
        it('Check the the warehouse - after reset', async () => {
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
    
          expect(warehouse.Inventory['1']).to.be.equal(7000);
          expect(warehouse.Inventory['2']).to.be.equal(7000);
          expect(warehouse.Inventory['3']).to.be.equal(7000);
          expect(warehouse.UserAllocations['1']).to.be.equal(3000);
          expect(warehouse.UserAllocations['2']).to.be.equal(3000);
          expect(warehouse.UserAllocations['2']).to.be.equal(3000);
        })

      })

    });

    describe("User-Specific tests from spreadsheet with multiple users", () => {
      describe("31 case - basic - with sufficient qty", async () => {
        const warehouseID = uuid();
        const orderID = uuid();
        const user = uuid();
        var itemsQty = 4;
        var usersQty = 10;
        var ordersQty = itemsQty;
        var orders: string[] = [];
        var initialOrders: string[] = [];
        var items: {[k: string]: any} = {};
        var users: string[] = [];
  
        it('Rebase warehouse', async () => {
          for (var i = 1; i <= itemsQty; i++) {
            var str = i.toString();
            items[str] = 10000;
          }
    
          await apiClient.rebase(warehouseID, items);

          for (var i = 0; i < usersQty; i++) {
            var user = uuid();
            users.push(user)
          }
      
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
      
          expect(warehouse.Inventory['1']).to.be.equal(10000);
          expect(warehouse.Inventory['2']).to.be.equal(10000);
          expect(warehouse.Inventory['3']).to.be.equal(10000);
          expect(warehouse.Inventory['4']).to.be.equal(10000);
          expect(warehouse.UserAllocations).to.be.empty;
        });
  
        it('Allocate user', async () => {
          await apiClient.createUserAllocation(warehouseID, users[0], '1', 1000, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, users[0], '2', 1000, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, users[0], '3', 1000, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, users[1], '1', 1000, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, users[1], '2', 1000, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, users[1], '3', 1000, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, users[2], '1', 1000, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, users[2], '2', 1000, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, users[2], '3', 1000, yesterday(), tomorrow());
        });
  
        it('Force reset allocaitons', () => apiClient.forceResetAllocations());
  
        it('Check the the warehouse', async () => {
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
    
          expect(warehouse.Inventory['1']).to.be.equal(7000);
          expect(warehouse.Inventory['2']).to.be.equal(7000);
          expect(warehouse.Inventory['3']).to.be.equal(7000);
          expect(warehouse.UserAllocations['1']).to.be.equal(3000);
          expect(warehouse.UserAllocations['2']).to.be.equal(3000);
          expect(warehouse.UserAllocations['2']).to.be.equal(3000);
        })
  
        it('Initial submit - order a few items using UserAlloc and Inventory qty - should success', async () => {        
          var successOrders = 0;
          var failOrders = 0;
          var userID = 0;

          for (var i = 0; i < usersQty; i++) {
            var order = uuid();
            orders.push(order)
          }

          // console.log("Users", users);
          // console.log("Orders", orders);

          await Promise.all(orders.map(order => (async () => {
            var user = users[userID];
            userID++;
            try {
              await apiClient.allocatedOrder(warehouseID, order, user, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: 2000
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: 2000
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: 2000
                }
              ])
              successOrders++;
              initialOrders.push(`${order}/${user}`);
              console.log(`Success - ${order}/${user}`);
            } catch (error) {
              failOrders++;
            }
          })()))
          
          let warehouse = await apiClient.getWarehouse(warehouseID);
          // let allocation = await apiClient.getOrderAllocations();

          console.log(warehouse);
          // console.log("Allocation", allocation);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.undefined;
          expect(warehouse.Inventory['2']).to.be.undefined;
          expect(warehouse.Inventory['3']).to.be.undefined;
          expect(warehouse.UserAllocations['1']).to.be.undefined;
          expect(warehouse.UserAllocations['2']).to.be.undefined;
          expect(warehouse.UserAllocations['3']).to.be.undefined;
          expect(successOrders + failOrders).to.be.equal(usersQty);
        });

        it('Cancel order - change qty to 0  - Inventory qty and UserAlloc should return - should success, with uncorrect qty', async () => {        
          var successOrders = 0;
          var failOrders = 0;
          var userID = 0;

          await Promise.all(orders.map(order => (async () => {
            var user = users[userID];
            userID++;
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
                }
              ])
              successOrders++;
              initialOrders.push(`${order}/${user}`);
              console.log(`Success - ${order}/${user}`);
            } catch (error) {
              failOrders++;
            }
          })()))
          
          let warehouse = await apiClient.getWarehouse(warehouseID);

          console.log(warehouse);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.equal(7000);
          expect(warehouse.Inventory['2']).to.be.equal(7000);
          expect(warehouse.Inventory['3']).to.be.equal(7000);
          expect(warehouse.Inventory['4']).to.be.equal(10000);
          expect(warehouse.UserAllocations['1']).to.be.equal(3000);
          expect(warehouse.UserAllocations['2']).to.be.equal(3000);
          expect(warehouse.UserAllocations['3']).to.be.equal(3000);
          expect(successOrders + failOrders).to.be.equal(usersQty);
        });
  
        it('Force reset allocaitons', () => apiClient.forceResetAllocations());
  
        it('Check the the warehouse - after reset', async () => {
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
    
          expect(warehouse.Inventory['1']).to.be.equal(7000);
          expect(warehouse.Inventory['2']).to.be.equal(7000);
          expect(warehouse.Inventory['3']).to.be.equal(7000);
          expect(warehouse.UserAllocations['1']).to.be.equal(3000);
          expect(warehouse.UserAllocations['2']).to.be.equal(3000);
          expect(warehouse.UserAllocations['2']).to.be.equal(3000);
        })

      })

    });
});


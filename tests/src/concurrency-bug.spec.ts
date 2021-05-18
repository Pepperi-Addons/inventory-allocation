import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from './helpers';
import { ApiClient } from './api-client';

const apiClient = new ApiClient();

describe("Basic tests from spreadsheet", () => {
    before(() => apiClient.install());

    after(() => apiClient.uninstall());

    describe("17 case - Modification qty in already submitted orders - with sufficient qty", async () => {
        const warehouseID = uuid();
        var ordersQty = 35;
        var orders: string[] = [];
        var initialOrders: string[] = [];
        var afterFirstChange: string[] = [];
        var afterSecondChange: string[] = [];
        var itemsQty = 10;
        var items: {[k: string]: any} = {};
        var warehouseAfterRebase: any = {};
        var warehouseAfterInitOrder: any = {};
        var warehouseAfterSecondOrder: any = {};
        var warehouseAfterThirdOrder: any = {};
        var warehouseAfterForthOrder: any = {};
    
        //Change test, save inventory after every test order
        //Problem now, if we have failed order on initial and second orders
        //Than on the third order we need to check orders with the first order and the second order
        //On every step make orders with already failed orders 

        it('Rebase warehouse', async () => {
          for (var i = 1; i <= itemsQty; i++) {
            var str = i.toString();
            items[str] = 10000;
          }
    
          await apiClient.rebase(warehouseID, items);
      
          const warehouse = await apiClient.getWarehouse(warehouseID);
          warehouseAfterRebase = warehouse;
          console.log(warehouse);
      
          expect(warehouse.Inventory['1']).to.be.equal(10000);
          expect(warehouse.Inventory['2']).to.be.equal(10000);
          expect(warehouse.Inventory['9']).to.be.equal(10000);
          expect(warehouse.Inventory['10']).to.be.equal(10000);
          expect(warehouse.UserAllocations).to.be.empty;
        });
    
        it(`Initial submit - order a few items with ${ordersQty} orders - should success`, async () => {   
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
                  UnitsQuantity: 100
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: 100
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: 100
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: 100
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: 100
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
                },
                {
                  ItemExternalID: '10',
                  UnitsQuantity: 100
                }
              ])
              successOrders++;
              // initialOrders.push(`${order}/${userId}`);
              userId++;
            } catch (error) {
              failOrders++;
              userId++;
            }
          })()))
                
          let warehouse = await apiClient.getWarehouse(warehouseID);
          warehouseAfterInitOrder = warehouse;

          console.log(warehouse);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.equal(warehouseAfterRebase["Inventory"]['1'] - (successOrders * 100) + (failOrders * 0));
          expect(warehouse.Inventory['2']).to.be.equal(warehouseAfterRebase["Inventory"]['2'] - (successOrders * 100) + (failOrders * 0));
          expect(warehouse.Inventory['3']).to.be.equal(warehouseAfterRebase["Inventory"]['3'] - (successOrders * 100) + (failOrders * 0));
          expect(warehouse.Inventory['4']).to.be.equal(warehouseAfterRebase["Inventory"]['4'] - (successOrders * 100) + (failOrders * 0));
          expect(warehouse.Inventory['5']).to.be.equal(warehouseAfterRebase["Inventory"]['5'] - (successOrders * 100) + (failOrders * 0));
          expect(warehouse.Inventory['6']).to.be.equal(warehouseAfterRebase["Inventory"]['6'] - (successOrders * 100) + (failOrders * 0));
          expect(warehouse.Inventory['7']).to.be.equal(warehouseAfterRebase["Inventory"]['7'] - (successOrders * 100) + (failOrders * 0));
          expect(warehouse.Inventory['8']).to.be.equal(warehouseAfterRebase["Inventory"]['8'] - (successOrders * 100) + (failOrders * 0));
          expect(warehouse.Inventory['9']).to.be.equal(warehouseAfterRebase["Inventory"]['9'] - (successOrders * 100) + (failOrders * 0));
          expect(warehouse.Inventory['10']).to.be.equal(warehouseAfterRebase["Inventory"]['10'] - (successOrders * 100) + (failOrders * 0));
          expect(successOrders + failOrders).to.be.equal(ordersQty);
        });
        
        it(`Second submit - change (+) items qty with success orders - should success`, async () => {        
          var successOrders = 0;
          var failOrders = 0;
          var userId = 0;

          await Promise.all(orders.map(order => (async () => {
            try {
              await apiClient.allocatedOrder(warehouseID, order, `${userId}`, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: 200
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: 200
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: 200
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: 200
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: 200
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
                },
                {
                  ItemExternalID: '10',
                  UnitsQuantity: 200
                }
              ])
              successOrders++;
              // afterFirstChange.push(`${order}/${user}`);
              userId++;
            } catch (error) {
              failOrders++;
            }
          })()))
    
          // await Promise.all(orders.map(orderUser => (async () => {
          //   var orderUserSplited = orderUser.split('/');
          //   var order = orderUserSplited[0]
          //   var user = orderUserSplited[1];
          //   try {
          //     await apiClient.allocatedOrder(warehouseID, order, user, [
          //       {
          //         ItemExternalID: '1',
          //         UnitsQuantity: 200
          //       },
          //       {
          //         ItemExternalID: '2',
          //         UnitsQuantity: 200
          //       },
          //       {
          //         ItemExternalID: '3',
          //         UnitsQuantity: 200
          //       },
          //       {
          //         ItemExternalID: '4',
          //         UnitsQuantity: 200
          //       },
          //       {
          //         ItemExternalID: '5',
          //         UnitsQuantity: 200
          //       },
          //       {
          //         ItemExternalID: '6',
          //         UnitsQuantity: 200
          //       },
          //       {
          //         ItemExternalID: '7',
          //         UnitsQuantity: 200
          //       },
          //       {
          //         ItemExternalID: '8',
          //         UnitsQuantity: 200
          //       },
          //       {
          //         ItemExternalID: '9',
          //         UnitsQuantity: 200
          //       },
          //       {
          //         ItemExternalID: '10',
          //         UnitsQuantity: 200
          //       }
          //     ])
          //     successOrders++;
          //     afterFirstChange.push(`${order}/${user}`);
          //   } catch (error) {
          //     failOrders++;
          //   }
          // })()))
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.equal(10000 - (successOrders * 200) - (failOrders * 100));
          expect(warehouse.Inventory['2']).to.be.equal(10000 - (successOrders * 200) - (failOrders * 100));
          expect(warehouse.Inventory['3']).to.be.equal(10000 - (successOrders * 200) - (failOrders * 100));
          expect(warehouse.Inventory['4']).to.be.equal(10000 - (successOrders * 200) - (failOrders * 100));
          expect(warehouse.Inventory['5']).to.be.equal(10000 - (successOrders * 200) - (failOrders * 100));
          expect(warehouse.Inventory['6']).to.be.equal(10000 - (successOrders * 200) - (failOrders * 100));
          expect(warehouse.Inventory['7']).to.be.equal(10000 - (successOrders * 200) - (failOrders * 100));
          expect(warehouse.Inventory['8']).to.be.equal(10000 - (successOrders * 200) - (failOrders * 100));
          expect(warehouse.Inventory['9']).to.be.equal(10000 - (successOrders * 200) - (failOrders * 100));
          expect(warehouse.Inventory['10']).to.be.equal(10000 - (successOrders * 200) - (failOrders * 100));
          expect(successOrders + failOrders).to.be.equal(initialOrders.length);
        });
    
        it(`Third submit - change (-) items qty with success orders - should success`, async () => {        
          var successOrders = 0;
          var failOrders = 0;
          var userId = 0;

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
                },
                {
                  ItemExternalID: '10',
                  UnitsQuantity: 50
                }
              ])
              successOrders++;
              // afterSecondChange.push(`${order}/${user}`);
              userId++;
            } catch (error) {
              failOrders++;
            }
          })()))
    
          // await Promise.all(afterFirstChange.map(orderUser => (async () => {
          //   var orderUserSplited = orderUser.split('/');
          //   var order = orderUserSplited[0]
          //   var user = orderUserSplited[1];
          //   try {
          //     await apiClient.allocatedOrder(warehouseID, order, user, [
          //       {
          //         ItemExternalID: '1',
          //         UnitsQuantity: 50
          //       },
          //       {
          //         ItemExternalID: '2',
          //         UnitsQuantity: 50
          //       },
          //       {
          //         ItemExternalID: '3',
          //         UnitsQuantity: 50
          //       },
          //       {
          //         ItemExternalID: '4',
          //         UnitsQuantity: 50
          //       },
          //       {
          //         ItemExternalID: '5',
          //         UnitsQuantity: 50
          //       },
          //       {
          //         ItemExternalID: '6',
          //         UnitsQuantity: 50
          //       },
          //       {
          //         ItemExternalID: '7',
          //         UnitsQuantity: 50
          //       },
          //       {
          //         ItemExternalID: '8',
          //         UnitsQuantity: 50
          //       },
          //       {
          //         ItemExternalID: '9',
          //         UnitsQuantity: 50
          //       },
          //       {
          //         ItemExternalID: '10',
          //         UnitsQuantity: 50
          //       }
          //     ])
          //     successOrders++;
          //     afterSecondChange.push(`${order}/${user}`);
          //   } catch (error) {
          //     failOrders++;
          //   }
          // })()))
                
      
          let warehouse = await apiClient.getWarehouse(warehouseID);
            
          console.log(warehouse);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failOrders);  
      
          expect(warehouse.Inventory['1']).to.be.equal(10000 - (successOrders * 50)  + (failOrders * 200));
          expect(warehouse.Inventory['2']).to.be.equal(10000 - (successOrders * 50)  + (failOrders * 200));
          expect(warehouse.Inventory['3']).to.be.equal(10000 - (successOrders * 50)  + (failOrders * 200));
          expect(warehouse.Inventory['4']).to.be.equal(10000 - (successOrders * 50)  + (failOrders * 200));
          expect(warehouse.Inventory['5']).to.be.equal(10000 - (successOrders * 50)  + (failOrders * 200));
          expect(warehouse.Inventory['6']).to.be.equal(10000 - (successOrders * 50)  + (failOrders * 200));
          expect(warehouse.Inventory['7']).to.be.equal(10000 - (successOrders * 50)  + (failOrders * 200));
          expect(warehouse.Inventory['8']).to.be.equal(10000 - (successOrders * 50)  + (failOrders * 200));
          expect(warehouse.Inventory['9']).to.be.equal(10000 - (successOrders * 50)  + (failOrders * 200));
          expect(warehouse.Inventory['10']).to.be.equal(10000 - (successOrders * 50)  + (failOrders * 200));
          expect(successOrders + failOrders).to.be.equal(afterSecondChange.length);
        });
    
        it(`Forth submit - cancel - change (0) items qty to 0 with success orders - should success`, async () => {        
          var successOrders = 0;
          var failOrders = 0;
          var userId = 0;

          await Promise.all(orders.map(order => (async () => {
            try {
              await apiClient.allocatedOrder(warehouseID, order, `${userId}`, [])
              successOrders++;
              userId++;
            } catch (error) {
              failOrders++;
            }
          })()))
    
          // await Promise.all(afterSecondChange.map(orderUser => (async () => {
          //   var orderUserSplited = orderUser.split('/');
          //   var order = orderUserSplited[0]
          //   var user = orderUserSplited[1];
          //   try {
          //     await apiClient.allocatedOrder(warehouseID, order, user, [])
          //     successOrders++;
          //   } catch (error) {
          //     failOrders++;
          //   }
          // })()))
      
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
          expect(warehouse.Inventory['10']).to.be.equal(10000);
          expect(successOrders + failOrders).to.be.equal(afterSecondChange.length);
        });
      })
});

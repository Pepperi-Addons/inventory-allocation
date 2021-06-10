import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("Timeout bug", () => {
    before(() => apiClient.install());

    after(() => apiClient.uninstall());

    describe("Timeout bug test - few users should be failed by timeout", async () => {
        const warehouseID = uuid();
        var ordersQty = 7;
        var orders: string[] = [];
        var itemsQty = 4;
        var items: {[k: string]: any} = {};
        var warehouseRebase: any = {};
        var warehouseInitOrder: any = {};
        var failedOrdersInit = 0;

        it('Rebase warehouse', async () => {
          for (var i = 1; i <= itemsQty; i++) {
            var str = i.toString();
            items[str] = 100000;
          }
    
          await apiClient.rebase(warehouseID, items);
      
          warehouseRebase = await apiClient.getWarehouse(warehouseID);
          console.log("Warehouse Rebase: ", warehouseRebase);
      
          expect(warehouseRebase.Inventory['1']).to.be.equal(100000);
          expect(warehouseRebase.Inventory['2']).to.be.equal(100000);
          expect(warehouseRebase.Inventory['3']).to.be.equal(100000);
          expect(warehouseRebase.Inventory['4']).to.be.equal(100000);
          expect(warehouseRebase.UserAllocations).to.be.empty;
        });
    
        it(`Initial submit - order a few items with ${ordersQty} orders - should success`, async () => {   
          var successOrders = 0;
          var userId = 0;
          var itemQty = 100;
    
          for (var i = 0; i < ordersQty; i++) {
            var order = uuid();
            orders.push(order)
          }
    
          await Promise.all(orders.map(order => (async () => {
            try {
              await apiClient.allocatedOrder(warehouseID, order, `${userId}`, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '6',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '7',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '8',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '9',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '10',
                  UnitsQuantity: itemQty
                }
              ])
              successOrders++;
              // initialOrders.push(`${order}/${userId}`);
              userId++;
            } catch (error) {
              console.log(error);
              failedOrdersInit++;
              userId++;
            }
          })()))
                
          warehouseInitOrder = await apiClient.getWarehouse(warehouseID);
          var allOrders = successOrders + failedOrdersInit;

          console.log("Warehouse Init Order: ", warehouseInitOrder);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders Init = ", failedOrdersInit);  

          expect(warehouseInitOrder.Inventory['1']).to.be.equal(warehouseRebase["Inventory"]['1'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['2']).to.be.equal(warehouseRebase["Inventory"]['2'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['3']).to.be.equal(warehouseRebase["Inventory"]['3'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['4']).to.be.equal(warehouseRebase["Inventory"]['4'] - (successOrders * itemQty));
          expect(allOrders).to.be.equal(ordersQty);
        });

        it(`Submit #2`, async () => {   
          var successOrders = 0;
          var userId = 0;
          var itemQty = 100;
    
          // for (var i = 0; i < ordersQty; i++) {
          //   var order = uuid();
          //   orders.push(order)
          // }
    
          await Promise.all(orders.map(order => (async () => {
            try {
              await apiClient.allocatedOrder(warehouseID, order, `${userId}`, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '6',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '7',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '8',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '9',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '10',
                  UnitsQuantity: itemQty
                }
              ])
              successOrders++;
              // initialOrders.push(`${order}/${userId}`);
              userId++;
            } catch (error) {
              console.log(error);
              failedOrdersInit++;
              userId++;
            }
          })()))
                
          warehouseInitOrder = await apiClient.getWarehouse(warehouseID);
          var allOrders = successOrders + failedOrdersInit;

          console.log("Warehouse Init Order: ", warehouseInitOrder);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders Init = ", failedOrdersInit);  

          expect(warehouseInitOrder.Inventory['1']).to.be.equal(warehouseRebase["Inventory"]['1'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['2']).to.be.equal(warehouseRebase["Inventory"]['2'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['3']).to.be.equal(warehouseRebase["Inventory"]['3'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['4']).to.be.equal(warehouseRebase["Inventory"]['4'] - (successOrders * itemQty));
          expect(allOrders).to.be.equal(ordersQty);
        });

        it(`Submit #3`, async () => {   
          var successOrders = 0;
          var userId = 0;
          var itemQty = 100;
    
          // for (var i = 0; i < ordersQty; i++) {
          //   var order = uuid();
          //   orders.push(order)
          // }
    
          await Promise.all(orders.map(order => (async () => {
            try {
              await apiClient.allocatedOrder(warehouseID, order, `${userId}`, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '6',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '7',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '8',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '9',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '10',
                  UnitsQuantity: itemQty
                }
              ])
              successOrders++;
              // initialOrders.push(`${order}/${userId}`);
              userId++;
            } catch (error) {
              console.log(error);
              failedOrdersInit++;
              userId++;
            }
          })()))
                
          warehouseInitOrder = await apiClient.getWarehouse(warehouseID);
          var allOrders = successOrders + failedOrdersInit;

          console.log("Warehouse Init Order: ", warehouseInitOrder);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders Init = ", failedOrdersInit);  

          expect(warehouseInitOrder.Inventory['1']).to.be.equal(warehouseRebase["Inventory"]['1'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['2']).to.be.equal(warehouseRebase["Inventory"]['2'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['3']).to.be.equal(warehouseRebase["Inventory"]['3'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['4']).to.be.equal(warehouseRebase["Inventory"]['4'] - (successOrders * itemQty));
          expect(allOrders).to.be.equal(ordersQty);
        });

        it('Wait one minute', () => sleep(60 * 1000));

        it(`Submit #4`, async () => {   
          var successOrders = 0;
          var userId = 0;
          var itemQty = 100;
    
          // for (var i = 0; i < ordersQty; i++) {
          //   var order = uuid();
          //   orders.push(order)
          // }
    
          await Promise.all(orders.map(order => (async () => {
            try {
              await apiClient.allocatedOrder(warehouseID, order, `${userId}`, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '6',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '7',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '8',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '9',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '10',
                  UnitsQuantity: itemQty
                }
              ])
              successOrders++;
              // initialOrders.push(`${order}/${userId}`);
              userId++;
            } catch (error) {
              console.log(error);
              failedOrdersInit++;
              userId++;
            }
          })()))
                
          warehouseInitOrder = await apiClient.getWarehouse(warehouseID);
          var allOrders = successOrders + failedOrdersInit;

          console.log("Warehouse Init Order: ", warehouseInitOrder);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders Init = ", failedOrdersInit);  

          expect(warehouseInitOrder.Inventory['1']).to.be.equal(warehouseRebase["Inventory"]['1'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['2']).to.be.equal(warehouseRebase["Inventory"]['2'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['3']).to.be.equal(warehouseRebase["Inventory"]['3'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['4']).to.be.equal(warehouseRebase["Inventory"]['4'] - (successOrders * itemQty));
          expect(allOrders).to.be.equal(ordersQty);
        });

        it(`Submit #5`, async () => {   
          var successOrders = 0;
          var userId = 0;
          var itemQty = 100;
    
          // for (var i = 0; i < ordersQty; i++) {
          //   var order = uuid();
          //   orders.push(order)
          // }
    
          await Promise.all(orders.map(order => (async () => {
            try {
              await apiClient.allocatedOrder(warehouseID, order, `${userId}`, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '6',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '7',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '8',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '9',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '10',
                  UnitsQuantity: itemQty
                }
              ])
              successOrders++;
              // initialOrders.push(`${order}/${userId}`);
              userId++;
            } catch (error) {
              console.log(error);
              failedOrdersInit++;
              userId++;
            }
          })()))
                
          warehouseInitOrder = await apiClient.getWarehouse(warehouseID);
          var allOrders = successOrders + failedOrdersInit;

          console.log("Warehouse Init Order: ", warehouseInitOrder);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders Init = ", failedOrdersInit);  

          expect(warehouseInitOrder.Inventory['1']).to.be.equal(warehouseRebase["Inventory"]['1'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['2']).to.be.equal(warehouseRebase["Inventory"]['2'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['3']).to.be.equal(warehouseRebase["Inventory"]['3'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['4']).to.be.equal(warehouseRebase["Inventory"]['4'] - (successOrders * itemQty));
          expect(allOrders).to.be.equal(ordersQty);
        });

        it('Wait one minute', () => sleep(60 * 1000));

        it(`Submit #6`, async () => {   
          var successOrders = 0;
          var userId = 0;
          var itemQty = 100;
    
          // for (var i = 0; i < ordersQty; i++) {
          //   var order = uuid();
          //   orders.push(order)
          // }
    
          await Promise.all(orders.map(order => (async () => {
            try {
              await apiClient.allocatedOrder(warehouseID, order, `${userId}`, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '6',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '7',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '8',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '9',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '10',
                  UnitsQuantity: itemQty
                }
              ])
              successOrders++;
              // initialOrders.push(`${order}/${userId}`);
              userId++;
            } catch (error) {
              console.log(error);
              failedOrdersInit++;
              userId++;
            }
          })()))
                
          warehouseInitOrder = await apiClient.getWarehouse(warehouseID);
          var allOrders = successOrders + failedOrdersInit;

          console.log("Warehouse Init Order: ", warehouseInitOrder);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders Init = ", failedOrdersInit);  

          expect(warehouseInitOrder.Inventory['1']).to.be.equal(warehouseRebase["Inventory"]['1'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['2']).to.be.equal(warehouseRebase["Inventory"]['2'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['3']).to.be.equal(warehouseRebase["Inventory"]['3'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['4']).to.be.equal(warehouseRebase["Inventory"]['4'] - (successOrders * itemQty));
          expect(allOrders).to.be.equal(ordersQty);
        });

        it(`Submit #7`, async () => {   
          var successOrders = 0;
          var userId = 0;
          var itemQty = 100;
    
          // for (var i = 0; i < ordersQty; i++) {
          //   var order = uuid();
          //   orders.push(order)
          // }
    
          await Promise.all(orders.map(order => (async () => {
            try {
              await apiClient.allocatedOrder(warehouseID, order, `${userId}`, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '6',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '7',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '8',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '9',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '10',
                  UnitsQuantity: itemQty
                }
              ])
              successOrders++;
              // initialOrders.push(`${order}/${userId}`);
              userId++;
            } catch (error) {
              console.log(error);
              failedOrdersInit++;
              userId++;
            }
          })()))
                
          warehouseInitOrder = await apiClient.getWarehouse(warehouseID);
          var allOrders = successOrders + failedOrdersInit;

          console.log("Warehouse Init Order: ", warehouseInitOrder);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders Init = ", failedOrdersInit);  

          expect(warehouseInitOrder.Inventory['1']).to.be.equal(warehouseRebase["Inventory"]['1'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['2']).to.be.equal(warehouseRebase["Inventory"]['2'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['3']).to.be.equal(warehouseRebase["Inventory"]['3'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['4']).to.be.equal(warehouseRebase["Inventory"]['4'] - (successOrders * itemQty));
          expect(allOrders).to.be.equal(ordersQty);
        });

        it('Wait one minute', () => sleep(60 * 1000));

        it(`Submit #8`, async () => {   
          var successOrders = 0;
          var userId = 0;
          var itemQty = 100;
    
          // for (var i = 0; i < ordersQty; i++) {
          //   var order = uuid();
          //   orders.push(order)
          // }
    
          await Promise.all(orders.map(order => (async () => {
            try {
              await apiClient.allocatedOrder(warehouseID, order, `${userId}`, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '6',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '7',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '8',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '9',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '10',
                  UnitsQuantity: itemQty
                }
              ])
              successOrders++;
              // initialOrders.push(`${order}/${userId}`);
              userId++;
            } catch (error) {
              console.log(error);
              failedOrdersInit++;
              userId++;
            }
          })()))
                
          warehouseInitOrder = await apiClient.getWarehouse(warehouseID);
          var allOrders = successOrders + failedOrdersInit;

          console.log("Warehouse Init Order: ", warehouseInitOrder);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders Init = ", failedOrdersInit);  

          expect(warehouseInitOrder.Inventory['1']).to.be.equal(warehouseRebase["Inventory"]['1'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['2']).to.be.equal(warehouseRebase["Inventory"]['2'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['3']).to.be.equal(warehouseRebase["Inventory"]['3'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['4']).to.be.equal(warehouseRebase["Inventory"]['4'] - (successOrders * itemQty));
          expect(allOrders).to.be.equal(ordersQty);
        });

        it(`Submit #9`, async () => {   
          var successOrders = 0;
          var userId = 0;
          var itemQty = 100;
    
          // for (var i = 0; i < ordersQty; i++) {
          //   var order = uuid();
          //   orders.push(order)
          // }
    
          await Promise.all(orders.map(order => (async () => {
            try {
              await apiClient.allocatedOrder(warehouseID, order, `${userId}`, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '2',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '3',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '4',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '5',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '6',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '7',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '8',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '9',
                  UnitsQuantity: itemQty
                },
                {
                  ItemExternalID: '10',
                  UnitsQuantity: itemQty
                }
              ])
              successOrders++;
              // initialOrders.push(`${order}/${userId}`);
              userId++;
            } catch (error) {
              console.log(error);
              failedOrdersInit++;
              userId++;
            }
          })()))
                
          warehouseInitOrder = await apiClient.getWarehouse(warehouseID);
          var allOrders = successOrders + failedOrdersInit;

          console.log("Warehouse Init Order: ", warehouseInitOrder);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders Init = ", failedOrdersInit);  

          expect(warehouseInitOrder.Inventory['1']).to.be.equal(warehouseRebase["Inventory"]['1'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['2']).to.be.equal(warehouseRebase["Inventory"]['2'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['3']).to.be.equal(warehouseRebase["Inventory"]['3'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['4']).to.be.equal(warehouseRebase["Inventory"]['4'] - (successOrders * itemQty));
          expect(allOrders).to.be.equal(ordersQty);
        });

      })
});

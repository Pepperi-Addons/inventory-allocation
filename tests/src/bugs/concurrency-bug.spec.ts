import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

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
        var warehouseRebase: any = {};
        var warehouseInitOrder: any = {};
        var warehouseSecondOrder: any = {};
        var warehouseThirdOrder: any = {};
        var warehouseForthOrder: any = {};
        var failedOrdersInit = 0;
        var failedOrdersSecond = 0;
        var failedOrdersThird = 0;
        var failedOrdersForth = 0;
    
        //Change test, save inventory after every test order
        //Problem now, if we have failed order on initial and second orders
        //Than on the third order we need to check orders with the first order and the second order
        //On every step make orders with already failed orders 
        // ------
        // At every stage caculate the current inventory, and then 
        // the next test should be relative to the inventory after the last test

        it('Rebase warehouse', async () => {
          for (var i = 1; i <= itemsQty; i++) {
            var str = i.toString();
            items[str] = 10000;
          }
    
          await apiClient.rebase(warehouseID, items);
      
          warehouseRebase = await apiClient.getWarehouse(warehouseID);
          console.log("Warehouse Rebase: ", warehouseRebase);
      
          expect(warehouseRebase.Inventory['1']).to.be.equal(10000);
          expect(warehouseRebase.Inventory['2']).to.be.equal(10000);
          expect(warehouseRebase.Inventory['9']).to.be.equal(10000);
          expect(warehouseRebase.Inventory['10']).to.be.equal(10000);
          expect(warehouseRebase.UserAllocations).to.be.empty;
        });
    
        it(`Initial submit - order a few items with ${ordersQty} orders - should success - if failed by timeout`, async () => {   
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
              initialOrders.push(`${order}/${userId}`);
              userId++;
            } catch (error) {
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
          expect(warehouseInitOrder.Inventory['5']).to.be.equal(warehouseRebase["Inventory"]['5'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['6']).to.be.equal(warehouseRebase["Inventory"]['6'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['7']).to.be.equal(warehouseRebase["Inventory"]['7'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['8']).to.be.equal(warehouseRebase["Inventory"]['8'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['9']).to.be.equal(warehouseRebase["Inventory"]['9'] - (successOrders * itemQty));
          expect(warehouseInitOrder.Inventory['10']).to.be.equal(warehouseRebase["Inventory"]['10'] - (successOrders * itemQty));
          expect(allOrders).to.be.equal(ordersQty);
        });
        
        it(`Second submit - change (+) items qty with success orders - should success`, async () => {        
          var successOrders = 0;
          var itemQty = 200;

          await Promise.all(initialOrders.map(orderUser => (async () => {
            var orderUserSplited = orderUser.split('/');
            var order = orderUserSplited[0]
            var user = orderUserSplited[1];
            try {
              await apiClient.allocatedOrder(warehouseID, order, user, [
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
              afterFirstChange.push(`${order}/${user}`);
            } catch (error) {
              ++failedOrdersSecond;
              console.log(`Error in warehouse ${warehouseID}`, error);
            }
          })()))
                
      
          warehouseSecondOrder = await apiClient.getWarehouse(warehouseID);
          var allOrders = successOrders + failedOrdersSecond;
          console.log("Warehouse Second Order: ", warehouseSecondOrder);
          console.log("Success Orders = ", successOrders);
          console.log("Failed Orders Second = ", failedOrdersSecond);  

          expect(warehouseSecondOrder.Inventory['1']).to.be.equal(warehouseInitOrder["Inventory"]['1'] - (successOrders * 100));
          expect(warehouseSecondOrder.Inventory['2']).to.be.equal(warehouseInitOrder["Inventory"]['2'] - (successOrders * 100));
          expect(warehouseSecondOrder.Inventory['3']).to.be.equal(warehouseInitOrder["Inventory"]['3'] - (successOrders * 100));
          expect(warehouseSecondOrder.Inventory['4']).to.be.equal(warehouseInitOrder["Inventory"]['4'] - (successOrders * 100));
          expect(warehouseSecondOrder.Inventory['5']).to.be.equal(warehouseInitOrder["Inventory"]['5'] - (successOrders * 100));
          expect(warehouseSecondOrder.Inventory['6']).to.be.equal(warehouseInitOrder["Inventory"]['6'] - (successOrders * 100));
          expect(warehouseSecondOrder.Inventory['7']).to.be.equal(warehouseInitOrder["Inventory"]['7'] - (successOrders * 100));
          expect(warehouseSecondOrder.Inventory['8']).to.be.equal(warehouseInitOrder["Inventory"]['8'] - (successOrders * 100));
          expect(warehouseSecondOrder.Inventory['9']).to.be.equal(warehouseInitOrder["Inventory"]['9'] - (successOrders * 100));
          expect(warehouseSecondOrder.Inventory['10']).to.be.equal(warehouseInitOrder["Inventory"]['10'] - (successOrders * 100));
          expect(allOrders).to.be.equal(initialOrders.length);
        });

        it(`Third submit - change (-) items qty with success orders - should success`, async () => {        
          var successOrders = 0;
          var itemQty = 50;

          await Promise.all(afterFirstChange.map(orderUser => (async () => {
            var orderUserSplited = orderUser.split('/');
            var order = orderUserSplited[0]
            var user = orderUserSplited[1];
            try {
              await apiClient.allocatedOrder(warehouseID, order, user, [
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
              afterSecondChange.push(`${order}/${user}`);
            } catch (error) {
              ++failedOrdersThird;
              console.log(`Error in warehouse ${warehouseID}`, error);
            }
          })()))
                

          warehouseThirdOrder = await apiClient.getWarehouse(warehouseID);
          var allOrders = successOrders + failedOrdersThird;

          console.log("Warehouse Third Order: ", warehouseThirdOrder);
          console.log("Success Orders = ", successOrders);
          console.log("Failed Orders Third = ", failedOrdersThird);

          expect(warehouseThirdOrder.Inventory['1']).to.be.equal(warehouseSecondOrder["Inventory"]['1'] + (successOrders * 150));
          expect(warehouseThirdOrder.Inventory['2']).to.be.equal(warehouseSecondOrder["Inventory"]['2'] + (successOrders * 150));
          expect(warehouseThirdOrder.Inventory['3']).to.be.equal(warehouseSecondOrder["Inventory"]['3'] + (successOrders * 150));
          expect(warehouseThirdOrder.Inventory['4']).to.be.equal(warehouseSecondOrder["Inventory"]['4'] + (successOrders * 150));
          expect(warehouseThirdOrder.Inventory['5']).to.be.equal(warehouseSecondOrder["Inventory"]['5'] + (successOrders * 150));
          expect(warehouseThirdOrder.Inventory['6']).to.be.equal(warehouseSecondOrder["Inventory"]['6'] + (successOrders * 150));
          expect(warehouseThirdOrder.Inventory['7']).to.be.equal(warehouseSecondOrder["Inventory"]['7'] + (successOrders * 150));
          expect(warehouseThirdOrder.Inventory['8']).to.be.equal(warehouseSecondOrder["Inventory"]['8'] + (successOrders * 150));
          expect(warehouseThirdOrder.Inventory['9']).to.be.equal(warehouseSecondOrder["Inventory"]['9'] + (successOrders * 150));
          expect(warehouseThirdOrder.Inventory['10']).to.be.equal(warehouseSecondOrder["Inventory"]['10'] + (successOrders * 150));
          expect(allOrders).to.be.equal(afterSecondChange.length);
        });
  
        it(`Forth submit - cancel - change (0) items qty to 0 with success orders - should success`, async () => {        
          var successOrders = 0;

          await Promise.all(afterSecondChange.map(orderUser => (async () => {
            var orderUserSplited = orderUser.split('/');
            var order = orderUserSplited[0]
            var user = orderUserSplited[1];
            try {
              await apiClient.allocatedOrder(warehouseID, order, user, [])
              successOrders++;
            } catch (error) {
              failedOrdersForth++;
              console.log(`Error in warehouse ${warehouseID}`, error);
            }
          })()))
      
          warehouseForthOrder = await apiClient.getWarehouse(warehouseID);
          var allOrders = successOrders + failedOrdersForth;

          console.log("Warehouse Forth Order: ", warehouseForthOrder);
          console.log("Success Orders = ", successOrders);
          console.log("Fail Orders = ", failedOrdersForth);  

          expect(warehouseForthOrder.Inventory['1']).to.be.equal(warehouseThirdOrder["Inventory"]['1'] + (successOrders * 50));
          expect(warehouseForthOrder.Inventory['2']).to.be.equal(warehouseThirdOrder["Inventory"]['2'] + (successOrders * 50));
          expect(warehouseForthOrder.Inventory['3']).to.be.equal(warehouseThirdOrder["Inventory"]['3'] + (successOrders * 50));
          expect(warehouseForthOrder.Inventory['4']).to.be.equal(warehouseThirdOrder["Inventory"]['4'] + (successOrders * 50));
          expect(warehouseForthOrder.Inventory['5']).to.be.equal(warehouseThirdOrder["Inventory"]['5'] + (successOrders * 50));
          expect(warehouseForthOrder.Inventory['6']).to.be.equal(warehouseThirdOrder["Inventory"]['6'] + (successOrders * 50));
          expect(warehouseForthOrder.Inventory['7']).to.be.equal(warehouseThirdOrder["Inventory"]['7'] + (successOrders * 50));
          expect(warehouseForthOrder.Inventory['8']).to.be.equal(warehouseThirdOrder["Inventory"]['8'] + (successOrders * 50));
          expect(warehouseForthOrder.Inventory['9']).to.be.equal(warehouseThirdOrder["Inventory"]['9'] + (successOrders * 50));
          expect(warehouseForthOrder.Inventory['10']).to.be.equal(warehouseThirdOrder["Inventory"]['10'] + (successOrders * 50));
          expect(allOrders).to.be.equal(afterSecondChange.length);
        });
      })
});

import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("Test - failed cancel transactions shouldn't stop rebase_all api", () => {
    before(() => apiClient.install());

    after(() => apiClient.uninstall());

    describe("Create 3 orders and then cancel all of them with rebase_all", async () => {
        const warehouseID = uuid();
        const userID = uuid();
        let orders: any[] = [];
        let order1: string = '';
        let order2: string = '';
        let order3: string = '';
        // let order4: string = '';
        // let order5: string = '';
        // let order6: string = '';
    
        it('Rebase warehouse', async () => {
            await apiClient.rebase(warehouseID, {
              '1': 4500,
            });
  
            const warehouse = await apiClient.getWarehouse(warehouseID);
            console.log(warehouse);
        
            expect(warehouse.Inventory['1']).to.be.equal(4500);
            expect(warehouse.UserAllocations).to.be.empty;
        });
    

        it('Make 2 orders, and 3rd one shouldnt be allocated = invalid', async () => {
          let ourOrders: any[] = [];
          order1 = uuid();
          order2 = uuid() + 'inv';
          order3 = uuid();
          // order4 = uuid();
          // order5 = uuid();
  
          orders.push(order1);
          orders.push(order2);
          orders.push(order3);
          // orders.push(order4);
          // orders.push(order5);
          ourOrders.push(order1);
          ourOrders.push(order3);

          await Promise.all(ourOrders.map(order => (async () => {
            try {
              let alloc = await apiClient.allocatedOrder(warehouseID, order, userID, [
                {
                  ItemExternalID: '1',
                  UnitsQuantity: 1
                }
              ])
              console.log("success", alloc);
            } catch (error) {
              console.log("error", error);
            }
          })()))

          const warehouse = await apiClient.getWarehouse(warehouseID);
          const orderAllocations = await apiClient.getOrderAllocations();
          console.log(warehouse);
          console.log(orderAllocations);
          console.log(orders);

          let checkOrder1 = orderAllocations.some((el: any) => el.OrderUUID == order1);
          let checkOrder2 = orderAllocations.some((el: any) => el.OrderUUID == order2);
          let checkOrder3 = orderAllocations.some((el: any) => el.OrderUUID == order3);

          expect(orders[0]).to.be.equal(order1);
          expect(orders[1]).to.be.equal(order2);
          expect(orders[2]).to.be.equal(order3);
          expect(orders.length).to.be.equal(3);
          expect(checkOrder1).to.be.equal(true)
          expect(checkOrder2).to.be.equal(false);
          expect(checkOrder3).to.be.equal(true);
          expect(warehouse.Inventory['1']).to.be.equal(4500 - 2);
        })

        // Success
        it('Cancel 3 orders, one of them should be invalid', async () => {
          console.log("all orders", orders.length);  
          console.log(orders);

          let rebase = await apiClient.rebaseAll([], orders, [{
              WarehouseID: warehouseID,
              Items: {
                  ['1']: 4500
              }
          }])

          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
          console.log(rebase);
    
          expect(orders.length).to.be.equal(3);
          expect(warehouse.Inventory['1']).to.be.equal(4500);
        })
    })
});

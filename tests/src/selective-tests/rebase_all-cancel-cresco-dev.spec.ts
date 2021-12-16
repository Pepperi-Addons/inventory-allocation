import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("Test case 09/07/2021 on Cresco DEV", () => {

  before(() => apiClient.install());

  after(() => apiClient.uninstall());

    describe("Create 75 orders and cancel them with rebase_all - should fail the last test", async () => {
        const warehouseID = uuid();
        const userID = uuid();
        let orders: any[] = [];

        it('Rebase warehouse', async () => {
          await apiClient.rebase(warehouseID, {
            '1': 4500
          });
      
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
      
          expect(warehouse.Inventory['1']).to.be.equal(4500);
          expect(warehouse.UserAllocations).to.be.empty;
        });

        it('Make 10 orders - 1', async () => {
            let ourOrders: any[] = []
            for (let i = 0; i < 10; i++) {
                let order = uuid();
                orders.push(order);
                ourOrders.push(order)
            }

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
          console.log(warehouse);
    
          expect(warehouse.Inventory['1']).to.be.equal(4500 - 10);
        })

        it('Make 10 more orders - 2', async () => {
            let ourOrders: any[] = []
            for (let i = 0; i < 10; i++) {
                let order = uuid();
                orders.push(order);
                ourOrders.push(order)
            }

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
          console.log(warehouse);
    
          expect(warehouse.Inventory['1']).to.be.equal(4500 - 20);
        })

        it('Make 10 more orders - 3', async () => {
            let ourOrders: any[] = []
            for (let i = 0; i < 10; i++) {
                let order = uuid();
                orders.push(order);
                ourOrders.push(order)
            }

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
          console.log(warehouse);
    
          expect(warehouse.Inventory['1']).to.be.equal(4500 - 30);
        })

        it('Make 10 more orders - 4', async () => {
            let ourOrders: any[] = []
            for (let i = 0; i < 10; i++) {
                let order = uuid();
                orders.push(order);
                ourOrders.push(order)
            }

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
          console.log(warehouse);
    
          expect(warehouse.Inventory['1']).to.be.equal(4500 - 40);
        })

        it('Make 10 more orders - 5', async () => {
          let ourOrders: any[] = []
          for (let i = 0; i < 10; i++) {
              let order = uuid();
              orders.push(order);
              ourOrders.push(order)
          }

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
          console.log(warehouse);
    
          expect(warehouse.Inventory['1']).to.be.equal(4500 - 50);
        })

        it('Make 10 more orders - 6', async () => {
          let ourOrders: any[] = []
          for (let i = 0; i < 10; i++) {
              let order = uuid();
              orders.push(order);
              ourOrders.push(order)
          }

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
          console.log(warehouse);
    
          expect(warehouse.Inventory['1']).to.be.equal(4500 - 60);
        })

        it('Make 10 more orders - 7', async () => {
          let ourOrders: any[] = []
          for (let i = 0; i < 10; i++) {
              let order = uuid();
              orders.push(order);
              ourOrders.push(order)
          }

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
          console.log(warehouse);
    
          expect(warehouse.Inventory['1']).to.be.equal(4500 - 70);
        })

        it('Make 5 more orders - 8', async () => {
          let ourOrders: any[] = []
          for (let i = 0; i < 5; i++) {
              let order = uuid();
              orders.push(order);
              ourOrders.push(order)
          }

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
          console.log(warehouse);
    
          expect(warehouse.Inventory['1']).to.be.equal(4500 - 75);
        })

        // Success
        // it('Commit all 75 orders - should Success', async () => {
        //     console.log(orders);
        //     console.log("all orders", orders.length);
        //     let rebase = await apiClient.rebaseAll(orders, [], [{
        //         WarehouseID: warehouseID,
        //         Items: {
        //             ['1']: 4500 - 75
        //         }
        //     }])

        //   const warehouse = await apiClient.getWarehouse(warehouseID);
        //   console.log(warehouse);
        //   console.log(rebase);
    
        //   expect(warehouse.Inventory['1']).to.be.equal(4500 - 75);
        // })

      // Fail
      it('Cancel all 75 orders - should Fail', async () => {
          console.log(orders);
          console.log("all orders", orders.length);

          let rebase = '';
          try {
            rebase = await apiClient.rebaseAll([], orders, [{
                WarehouseID: warehouseID,
                Items: {
                    ['1']: 4500
                }
            }])
            console.log("success", rebase);
          } catch (error) {
            console.log("error", error);
          }

        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
        console.log(rebase);
    
        expect(warehouse.Inventory['1']).to.be.equal(4425);
      })

    })
});

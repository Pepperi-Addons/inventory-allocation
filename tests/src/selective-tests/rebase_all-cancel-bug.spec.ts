import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("Test case rebase_all api", () => {
    // before(() => apiClient.install());

    // after(() => apiClient.uninstall());

    describe("Create 10 orders and then cancel all of them with rebase_all - should success, if 20 - should fail", async () => {
      const warehouseID = uuid();
      const userID = uuid();
      let orders: any[] = [];
  
      it('Rebase warehouse', async () => {
          await apiClient.rebase(warehouseID, {
            '1': 4500,
          });

          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
      
          expect(warehouse.Inventory['1']).to.be.equal(4500);
          expect(warehouse.UserAllocations).to.be.empty;
      });

      it('Make 10 orders', async () => {
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

    it('Cancel all 10 orders', async () => {
        console.log(orders);
        console.log("all orders", orders.length);
        let rebase: any = '';
        try {
          rebase = await apiClient.rebaseAll([], orders, [{
              WarehouseID: "41",
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
  
      expect(warehouse.Inventory['1']).to.be.equal(4500);
      expect(rebase['Success']).to.be.equal(true);
    })

  })

    describe("Create 15 orders and then cancel all of them with rebase_all - should success, if 20 - should fail", async () => {
      const warehouseID = uuid();
      const userID = uuid();
      let orders: any[] = [];
  
      it('Rebase warehouse', async () => {
          await apiClient.rebase(warehouseID, {
            '1': 4500,
          });

          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
      
          expect(warehouse.Inventory['1']).to.be.equal(4500);
          expect(warehouse.UserAllocations).to.be.empty;
      });

      it('Make 15 orders', async () => {
        let ourOrders: any[] = []
        for (let i = 0; i < 15; i++) {
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
  
        expect(warehouse.Inventory['1']).to.be.equal(4500 - 15);
      })

    // Success
    it('Cancel all 15 orders', async () => {
        console.log(orders);
        console.log("all orders", orders.length);
        let rebase = '';
        try {
          rebase = await apiClient.rebaseAll([], orders, [{
              WarehouseID: "41",
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
  
      expect(warehouse.Inventory['1']).to.be.equal(4500 - 15);
    })

  })

    describe("Create 100 orders and then commit all of them with rebase_all", async () => {
        const warehouseID = uuid();
        const userID = uuid();
        let orders: any[] = [];
    
        it('Rebase warehouse', async () => {
            await apiClient.rebase(warehouseID, {
              '1': 4500,
            });
  
            const warehouse = await apiClient.getWarehouse(warehouseID);
            console.log(warehouse);
        
            expect(warehouse.Inventory['1']).to.be.equal(4500);
            expect(warehouse.UserAllocations).to.be.empty;
        });
    

        it('Make 20 orders - 1', async () => {
            let ourOrders: any[] = []
            for (let i = 0; i < 20; i++) {
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

        it('Make 20 more orders - 2', async () => {
            let ourOrders: any[] = []
            for (let i = 0; i < 20; i++) {
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

        it('Make 20 more orders - 3', async () => {
            let ourOrders: any[] = []
            for (let i = 0; i < 20; i++) {
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

        it('Make 20 more orders - 4', async () => {
            let ourOrders: any[] = []
            for (let i = 0; i < 20; i++) {
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

        it('Make 20 more orders - 5', async () => {
          let ourOrders: any[] = []
          for (let i = 0; i < 20; i++) {
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
        it('Commit all 100 orders', async () => {
            console.log(orders);
            console.log("all orders", orders.length);
            let rebase = await apiClient.rebaseAll(orders, [], [{
                WarehouseID: "41",
                Items: {
                    ['1']: 4500 - 100
                }
            }])

          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
          console.log(rebase);
    
          expect(warehouse.Inventory['1']).to.be.equal(4500 - 100);
        })
    })
});

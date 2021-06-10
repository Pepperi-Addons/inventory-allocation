import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("Basic tests with commit orders", () => {
    before(() => apiClient.install());

    after(() => apiClient.uninstall());
    
  describe("Create a few orders with different items, commit one/two of them and check inventory", async () => {
    const warehouseID = uuid();
    const orderID = uuid();
    const orderID2 = uuid();
    const orderID3 = uuid();
    const user1 = uuid();
    var itemsQty = 3;
    var items: {[k: string]: any} = {};

    it('Rebase warehouse', async () => {
        for (var i = 1; i <= itemsQty; i++) {
          var str = i.toString();
          items[str] = 5000;
        }

        await apiClient.rebase(warehouseID, items);

        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
    
        expect(warehouse.Inventory['1']).to.be.equal(5000);
        expect(warehouse.Inventory['2']).to.be.equal(5000);
        expect(warehouse.Inventory['3']).to.be.equal(5000);
        expect(warehouse.UserAllocations).to.be.empty;
    });

    it('Three users submit the order', async () => {
      const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, [
        {
          ItemExternalID: '1',
          UnitsQuantity: 200
        },
        {
          ItemExternalID: '1',
          UnitsQuantity: 200
        }
      ])

      const res2 = await apiClient.allocatedOrder(warehouseID, orderID2, user1, [
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
        }
      ])

      const res3 = await apiClient.allocatedOrder(warehouseID, orderID3, user1, [
        {
          ItemExternalID: '1',
          UnitsQuantity: 200
        },
        {
          ItemExternalID: '1',
          UnitsQuantity: 200
        },
        {
          ItemExternalID: '1',
          UnitsQuantity: 200
        },
        {
          ItemExternalID: '2',
          UnitsQuantity: 200
        }
      ])

      const warehouse = await apiClient.getWarehouse(warehouseID);
      console.log(warehouse);

      expect(warehouse.Inventory['1']).to.be.equal(3800);
      expect(warehouse.Inventory['2']).to.be.equal(4600);
      expect(warehouse.Inventory['3']).to.be.equal(4800);
    })

    it('Commit the first order, check inventory', async () => {
      const res = await apiClient.rebaseAll([orderID],[],[{
        WarehouseID: warehouseID,
        Items: {
          '1': 4600
          }
        } 
      ])

      const warehouse = await apiClient.getWarehouse(warehouseID);
      console.log("Commit", res);
      console.log(warehouse);

      expect(res.Success).to.be.true;
      expect(warehouse.Inventory['1']).to.be.equal(3800);
      expect(warehouse.Inventory['2']).to.be.equal(4600);
      expect(warehouse.Inventory['3']).to.be.equal(4800);
    })

    it('Commit the other two orders, check inventory', async () => {
      const res = await apiClient.rebaseAll([orderID2, orderID3],[],[{
        WarehouseID: warehouseID,
        Items: {
          '1': 3800,
          '2': 4600,
          '3': 4800
          }
        } 
      ])

      const warehouse = await apiClient.getWarehouse(warehouseID);
      console.log("Commit", res);
      console.log(warehouse);

      expect(res.Success).to.be.true;
      expect(warehouse.Inventory['1']).to.be.equal(3800);
      expect(warehouse.Inventory['2']).to.be.equal(4600);
      expect(warehouse.Inventory['3']).to.be.equal(4800);  
    })
  })

  describe("Create allocation for 4 users, submit with one/two users, deallocate the first one, commit first order then second one, inventory should be correct", async () => {
    const warehouseID = uuid();
    const orderID = uuid();
    const orderID2 = uuid();
    const user1 = uuid();
    const user2 = uuid();
    const user3 = uuid();
    const user4 = uuid();
    var itemsQty = 1;
    var items: {[k: string]: any} = {};

    it('Rebase warehouse', async () => {
        for (var i = 1; i <= itemsQty; i++) {
          var str = i.toString();
          items[str] = 5000;
        }
  
        await apiClient.rebase(warehouseID, items);

        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
    
        expect(warehouse.Inventory['1']).to.be.equal(5000);
        expect(warehouse.UserAllocations).to.be.empty;
    });

    it('Allocate users', async () => {
        await apiClient.createUserAllocation(warehouseID, user1, '1', 1000, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user2, '1', 1000, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user3, '1', 1000, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user4, '1', 1000, yesterday(), tomorrow());
    });

    it('Force reset allocaitons', () => apiClient.forceResetAllocations());

    it('Check the warehouse', async () => {
      const warehouse = await apiClient.getWarehouse(warehouseID);
      console.log(warehouse);

      expect(warehouse.Inventory['1']).to.be.equal(1000);
      expect(warehouse.UserAllocations['1']).to.be.equal(4000);
    })

    it('Users submit the order', async () => {
      const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, [
        {
          ItemExternalID: '1',
          UnitsQuantity: 100
        }
      ])

      const res2 = await apiClient.allocatedOrder(warehouseID, orderID2, user2, [
        {
          ItemExternalID: '1',
          UnitsQuantity: 100
        }
      ])

      const warehouse = await apiClient.getWarehouse(warehouseID);
      const userAllocations = await apiClient.getUserAllocation()
      console.log(warehouse);
      console.log(userAllocations);

      expect(warehouse.Inventory['1']).to.be.equal(1000);
      expect(warehouse.UserAllocations['1']).to.be.equal(3800);
    })

    it('Deallocate another user', async () => {
      await apiClient.createUserAllocation(warehouseID, user1, '1', 1000, yesterday(), yesterday());
    });

    it('Force reset allocaitons', () => apiClient.forceResetAllocations());

    it('Check the warehouse', async () => {
      const warehouse = await apiClient.getWarehouse(warehouseID);
      const userAllocations = await apiClient.getUserAllocation()
      console.log(warehouse);
      console.log(userAllocations);

      expect(warehouse.Inventory['1']).to.be.equal(1900);
      expect(warehouse.UserAllocations['1']).to.be.equal(2900);
      userAllocations.forEach((element: any) => {
        if (element.UserID == user1)
          expect(element.Allocated).to.be.false;
      });
    })

    it('Commit the first order', async () => {
      const res = await apiClient.rebaseAll([orderID],[],[{
        WarehouseID: warehouseID,
        Items: {
          "1": 4900
          }
        } 
      ])

      const warehouse = await apiClient.getWarehouse(warehouseID);
      console.log("Commit", res);
      console.log(warehouse);

      expect(res.Success).to.be.true;
      expect(warehouse.Inventory['1']).to.be.equal(1900);
      expect(warehouse.UserAllocations['1']).to.be.equal(2900);
    })

    it('Commit the second order', async () => {
      const res = await apiClient.rebaseAll([orderID2],[],[{
        WarehouseID: warehouseID,
        Items: {
          "1": 4800
          }
        } 
      ])

      const warehouse = await apiClient.getWarehouse(warehouseID);
      console.log("Commit", res);
      console.log(warehouse);

      expect(res.Success).to.be.true;
      expect(warehouse.Inventory['1']).to.be.equal(1900);
      expect(warehouse.UserAllocations['1']).to.be.equal(2900);
    })
  })

  describe("Create a few orders, create user allocations, commit one/two of them and check inventory", async () => {
    const warehouseID = uuid();
    const orderID = uuid();
    const orderID2 = uuid();
    const orderID3 = uuid();
    const user1 = uuid();
    const user2 = uuid();
    const user3 = uuid();
    var itemsQty = 3;
    var items: {[k: string]: any} = {};
  
    it('Rebase warehouse', async () => {
        for (var i = 1; i <= itemsQty; i++) {
          var str = i.toString();
          items[str] = 5000;
        }
  
        await apiClient.rebase(warehouseID, items);
  
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
    
        expect(warehouse.Inventory['1']).to.be.equal(5000);
        expect(warehouse.Inventory['2']).to.be.equal(5000);
        expect(warehouse.Inventory['3']).to.be.equal(5000);
        expect(warehouse.UserAllocations).to.be.empty;
    });
  
    it('Three users submit the order', async () => {
      const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, [
        {
          ItemExternalID: '1',
          UnitsQuantity: 200
        },
        {
          ItemExternalID: '1',
          UnitsQuantity: 200
        }
      ])
  
      const res2 = await apiClient.allocatedOrder(warehouseID, orderID2, user2, [
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
        }
      ])
  
      const res3 = await apiClient.allocatedOrder(warehouseID, orderID3, user3, [
        {
          ItemExternalID: '1',
          UnitsQuantity: 200
        },
        {
          ItemExternalID: '1',
          UnitsQuantity: 200
        },
        {
          ItemExternalID: '1',
          UnitsQuantity: 200
        },
        {
          ItemExternalID: '2',
          UnitsQuantity: 200
        }
      ])
  
      const warehouse = await apiClient.getWarehouse(warehouseID);
      console.log(warehouse);
  
      expect(warehouse.Inventory['1']).to.be.equal(3800);
      expect(warehouse.Inventory['2']).to.be.equal(4600);
      expect(warehouse.Inventory['3']).to.be.equal(4800);
    })

    it('Allocate users', async () => {
      await apiClient.createUserAllocation(warehouseID, user1, '1', 1000, yesterday(), tomorrow());
      await apiClient.createUserAllocation(warehouseID, user1, '2', 1000, yesterday(), tomorrow());
      await apiClient.createUserAllocation(warehouseID, user1, '3', 1000, yesterday(), tomorrow());
      await apiClient.createUserAllocation(warehouseID, user2, '1', 1000, yesterday(), tomorrow());
      await apiClient.createUserAllocation(warehouseID, user2, '2', 1000, yesterday(), tomorrow());
      await apiClient.createUserAllocation(warehouseID, user2, '3', 1000, yesterday(), tomorrow());
      await apiClient.createUserAllocation(warehouseID, user3, '1', 1000, yesterday(), tomorrow());
      await apiClient.createUserAllocation(warehouseID, user3, '2', 1000, yesterday(), tomorrow());
      await apiClient.createUserAllocation(warehouseID, user3, '3', 1000, yesterday(), tomorrow());
    });

    it('Force reset allocaitons', () => apiClient.forceResetAllocations());

    it('Check the warehouse', async () => {
      const warehouse = await apiClient.getWarehouse(warehouseID);
      console.log(warehouse);

      expect(warehouse.Inventory['1']).to.be.equal(800);
      expect(warehouse.Inventory['2']).to.be.equal(1600);
      expect(warehouse.Inventory['3']).to.be.equal(1800);
      expect(warehouse.UserAllocations['1']).to.be.equal(3000);
      expect(warehouse.UserAllocations['2']).to.be.equal(3000);
      expect(warehouse.UserAllocations['3']).to.be.equal(3000);
    })
  
    it('Commit the first order, check inventory', async () => {
      const res = await apiClient.rebaseAll([orderID],[],[{
        WarehouseID: warehouseID,
        Items: {
          '1': 4600
          }
        } 
      ])
  
      const warehouse = await apiClient.getWarehouse(warehouseID);
      console.log("Commit", res);
      console.log(warehouse);
  
      expect(res.Success).to.be.true;
      expect(warehouse.Inventory['1']).to.be.equal(800);
      expect(warehouse.Inventory['2']).to.be.equal(1600);
      expect(warehouse.Inventory['3']).to.be.equal(1800);
      expect(warehouse.UserAllocations['1']).to.be.equal(3000);
      expect(warehouse.UserAllocations['2']).to.be.equal(3000);
      expect(warehouse.UserAllocations['3']).to.be.equal(3000);
    })
  
    it('Commit the other two orders, check inventory', async () => {
      const res = await apiClient.rebaseAll([orderID2, orderID3],[],[{
        WarehouseID: warehouseID,
        Items: {
          '1': 3800,
          '2': 4600,
          '3': 4800
          }
        } 
      ])
  
      const warehouse = await apiClient.getWarehouse(warehouseID);
      console.log("Commit", res);
      console.log(warehouse);
  
      expect(res.Success).to.be.true;
      expect(warehouse.Inventory['1']).to.be.equal(800);
      expect(warehouse.Inventory['2']).to.be.equal(1600);
      expect(warehouse.Inventory['3']).to.be.equal(1800);
      expect(warehouse.UserAllocations['1']).to.be.equal(3000);
      expect(warehouse.UserAllocations['2']).to.be.equal(3000);
      expect(warehouse.UserAllocations['3']).to.be.equal(3000);
    })
  })
});

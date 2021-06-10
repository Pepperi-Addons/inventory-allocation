import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("Commit orders bug", () => {
    before(() => apiClient.install());

    after(() => apiClient.uninstall());

    describe("Commit Orders bug - Create allocation for 4 users, submit with one user, commit this order, inventory should be correct", async () => {
      const warehouseID = uuid();
      const orderID = uuid();
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

      it('First user submit the order', async () => {
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, [
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
        expect(warehouse.UserAllocations['1']).to.be.equal(3900);
      })

      it('Commit the order', async () => {
        const res = await apiClient.rebaseAll([orderID],[],[{
          WarehouseID: warehouseID,
          Items: {
            "1": 4900
            }
          } 
        ])

        const warehouse = await apiClient.getWarehouse(warehouseID);
        const userAllocations = await apiClient.getUserAllocation()
        console.log("Commit", res);
        console.log(warehouse);
        console.log(userAllocations);

        expect(res.Success).to.be.true;
        expect(warehouse.Inventory['1']).to.be.equal(1000);
        expect(warehouse.UserAllocations['1']).to.be.equal(3900);
      })
  })

});

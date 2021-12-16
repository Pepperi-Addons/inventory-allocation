import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("Commit orders bug", () => {
    before(() => apiClient.install());

    after(() => apiClient.uninstall());

    describe("Commit Orders bug - Create allocation for 1 user, submit with one user, commit this order, inventory should be correct", async () => {
      const warehouseID = uuid();
      const orderID = uuid();
      const user1 = uuid();
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
  
      it('Check the warehouse', async () => {
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
  
        expect(warehouse.Inventory['1']).to.be.equal(5000);
      })

      it('First user submit the order', async () => {
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 100
          }
        ])

        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
  
        expect(warehouse.Inventory['1']).to.be.equal(4900);
      })


      it('Check the warehouse', async () => {
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
  
        expect(warehouse.Inventory['1']).to.be.equal(4900);
      })

      it('Commit the order', async () => {
        const res = await apiClient.rebaseAll([orderID],[],[ ])

        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log("Commit", res);
        console.log(warehouse);

        expect(res.Success).to.be.true;
        expect(warehouse.Inventory['1']).to.be.equal(4900);
      })


      it('Commit the order again 2', async () => {
        const res = await apiClient.rebaseAll([orderID],[],[ ])

        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log("Commit", res);
        console.log(warehouse);

        expect(res.Success).to.be.true;
        expect(warehouse.Inventory['1']).to.be.equal(4900);
      })

      it('Commit the order again 3', async () => {
        const res = await apiClient.rebaseAll([orderID],[],[ ])

        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log("Commit", res);
        console.log(warehouse);

        expect(res.Success).to.be.true;
        expect(warehouse.Inventory['1']).to.be.equal(4900);
      })

      it('Commit the order again 4', async () => {
        const res = await apiClient.rebaseAll([orderID],[],[ ])

        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log("Commit", res);
        console.log(warehouse);

        expect(res.Success).to.be.true;
        expect(warehouse.Inventory['1']).to.be.equal(4900);
      })


  })

});

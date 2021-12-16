import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("More than 100 items in the order bug", () => {
    before(() => apiClient.install());
    after(() => apiClient.uninstall());

    describe("Create allocation with more than 100 items, submit, check warehouse, check allocation - should be correct", async () => {
      const warehouseID = uuid();
      const orderID = uuid();
      const userId = uuid();
      var itemsQty = 150;
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
          expect(warehouse.Inventory['25']).to.be.equal(5000);
          expect(warehouse.Inventory['50']).to.be.equal(5000);
          expect(warehouse.Inventory['75']).to.be.equal(5000);
          expect(warehouse.Inventory['100']).to.be.equal(5000);
          expect(warehouse.Inventory['125']).to.be.equal(5000);
          expect(warehouse.UserAllocations).to.be.empty;
      });
  

      it(`Submit order with ${itemsQty} items`, async () => {
        let unitsQty = 200;
        let items = [];
        for (var i = 1; i <= itemsQty; i++) {
            items.push({
                ItemExternalID: i.toString(),
                UnitsQuantity: unitsQty
            });
        }

        const res = await apiClient.allocatedOrder(warehouseID, orderID, userId, items)

        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
  
        expect(warehouse.Inventory['1']).to.be.equal(5000 - unitsQty);
        expect(warehouse.Inventory['25']).to.be.equal(5000 - unitsQty);
        expect(warehouse.Inventory['50']).to.be.equal(5000 - unitsQty);
        expect(warehouse.Inventory['75']).to.be.equal(5000 - unitsQty);
        expect(warehouse.Inventory['100']).to.be.equal(5000 - unitsQty);
        expect(warehouse.Inventory['125']).to.be.equal(5000 - unitsQty);
      })

      it('Validate allocation', async () => {
        const res = await apiClient.getOrderAllocations();
        let allocation = await res.filter((el: any) => el.OrderUUID == orderID);
        console.log('Our Allocation', allocation);

        let itemsAllocationQty = Object.keys(allocation[0]["ItemAllocations"]).length
        console.log('Qty of items', itemsAllocationQty);

        expect(itemsAllocationQty).to.be.equal(itemsQty);
      })
  })

  describe("Create allocation with more than 99 items, add more than 20 items, submit, check warehouse, check allocation - should be correct", async () => {
    const warehouseID = uuid();
    const orderID = uuid();
    const userId = uuid();
    var itemsQty = 150;
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
        expect(warehouse.Inventory['25']).to.be.equal(5000);
        expect(warehouse.Inventory['50']).to.be.equal(5000);
        expect(warehouse.Inventory['75']).to.be.equal(5000);
        expect(warehouse.Inventory['100']).to.be.equal(5000);
        expect(warehouse.Inventory['125']).to.be.equal(5000);
        expect(warehouse.Inventory['150']).to.be.equal(5000);
        expect(warehouse.UserAllocations).to.be.empty;
    });


    it(`Submit order with 99 items`, async () => {
      let unitsQty = 200;
      let items = [];
      for (var i = 1; i <= 99; i++) {
          items.push({
              ItemExternalID: i.toString(),
              UnitsQuantity: unitsQty
          });
      }

      const res = await apiClient.allocatedOrder(warehouseID, orderID, userId, items)

      const warehouse = await apiClient.getWarehouse(warehouseID);
      console.log(warehouse);

      expect(warehouse.Inventory['1']).to.be.equal(5000 - unitsQty);
      expect(warehouse.Inventory['25']).to.be.equal(5000 - unitsQty);
      expect(warehouse.Inventory['50']).to.be.equal(5000 - unitsQty);
      expect(warehouse.Inventory['75']).to.be.equal(5000 - unitsQty);
      expect(warehouse.Inventory['99']).to.be.equal(5000 - unitsQty);
    })

    it(`Add new 21 items to original order`, async () => {
      let unitsQty = 200;
      let items = [];
      for (var i = 1; i <= 120; i++) {
          items.push({
              ItemExternalID: i.toString(),
              UnitsQuantity: unitsQty
          });
      }

      const res = await apiClient.allocatedOrder(warehouseID, orderID, userId, items)

      const warehouse = await apiClient.getWarehouse(warehouseID);
      console.log(warehouse);

      expect(warehouse.Inventory['1']).to.be.equal(5000 - unitsQty);
      expect(warehouse.Inventory['25']).to.be.equal(5000 - unitsQty);
      expect(warehouse.Inventory['50']).to.be.equal(5000 - unitsQty);
      expect(warehouse.Inventory['75']).to.be.equal(5000 - unitsQty);
      expect(warehouse.Inventory['100']).to.be.equal(5000 - unitsQty);
      expect(warehouse.Inventory['120']).to.be.equal(5000 - unitsQty);
    })

    it('Validate allocation', async () => {
      const res = await apiClient.getOrderAllocations();
      let allocation = await res.filter((el: any) => el.OrderUUID == orderID);
      console.log('Our Allocation', allocation);

      let itemsAllocationQty = Object.keys(allocation[0]["ItemAllocations"]).length
      console.log('Qty of items', itemsAllocationQty);

      expect(itemsAllocationQty).to.be.equal(120);
    })
  })

});

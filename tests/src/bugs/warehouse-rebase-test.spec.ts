import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("Warehouse rebase on new addon version v64", () => {
    before(() => apiClient.install());

    after(() => apiClient.uninstall());

    describe("New warehouse test case - all should success", async () => {
      const warehouseID = uuid();
      const orderID = uuid();
      const user = uuid();

      it('Rebase warehouse', async () => {
        await apiClient.rebase(warehouseID, {
          '1': 100,
          '2': 200
        });
    
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
    
        expect(warehouse.Inventory['1']).to.be.equal(100);
        expect(warehouse.Inventory['2']).to.be.equal(200);
        expect(warehouse.UserAllocations).to.be.empty;
      });

      it('Second rebase warehouse', async () => {
        await apiClient.rebase(warehouseID, {
          '3': 300,
          '4': 400
        });
    
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
    
        expect(warehouse.Inventory['1']).to.be.equal(100);
        expect(warehouse.Inventory['2']).to.be.equal(200);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(400);
        expect(warehouse.UserAllocations).to.be.empty;
      });

      it('Third rebase warehouse', async () => {
        await apiClient.rebase(warehouseID, {
          '1': 600,
          '5': 700
        });
    
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
    
        expect(warehouse.Inventory['1']).to.be.equal(600);
        expect(warehouse.Inventory['2']).to.be.equal(200);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(400);
        expect(warehouse.Inventory['5']).to.be.equal(700);
        expect(warehouse.UserAllocations).to.be.empty;
      });

    })
});

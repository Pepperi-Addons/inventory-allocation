import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("Package bug", () => {
    before(() => apiClient.install());

    after(() => apiClient.uninstall());

    describe("Package bug - order a package, after init order change qty of items in package, after second submit qty should change without issues", async () => {
        const warehouseID = uuid();
        const orderID = uuid();
        const user1 = uuid();
        const user2 = uuid();
    
        it('Rebase warehouse', async () => {
            await apiClient.rebase(warehouseID, {
                '140-800003': 5000,
                '140-800012': 5000,
                '140-800018': 5000,
                '140-800019': 5000,
                '140-800020': 5000,
                '140-800021': 5000,
                '120-996203': 5000,
                '120-996303': 5000,
            });
        
            const warehouse = await apiClient.getWarehouse(warehouseID);
            console.log(warehouse);
        
            expect(warehouse.Inventory['140-800003']).to.be.equal(5000);
            expect(warehouse.Inventory['140-800012']).to.be.equal(5000);
            expect(warehouse.Inventory['140-800018']).to.be.equal(5000);
            expect(warehouse.Inventory['140-800019']).to.be.equal(5000);
            expect(warehouse.Inventory['140-800020']).to.be.equal(5000);
            expect(warehouse.Inventory['140-800021']).to.be.equal(5000);
            expect(warehouse.Inventory['120-996203']).to.be.equal(5000);
            expect(warehouse.Inventory['120-996303']).to.be.equal(5000);
            expect(warehouse.UserAllocations).to.be.empty;
        });

        it('Initial order - order should went through and inventory should have a correct qty', async () => {
          const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, [
            {
              ItemExternalID: '140-800003',
              UnitsQuantity: 5
            },
            {
              ItemExternalID: '140-800012',
              UnitsQuantity: 5
            },
            {
              ItemExternalID: '140-800018',
              UnitsQuantity: 5
            },
            {
              ItemExternalID: '140-800019',
              UnitsQuantity: 5
            },
            {
              ItemExternalID: '140-800020',
              UnitsQuantity: 5
            },
            {
              ItemExternalID: '140-800021',
              UnitsQuantity: 5
            },
            {
              ItemExternalID: '120-996203',
              UnitsQuantity: 5
            },
            {
              ItemExternalID: '120-996303',
              UnitsQuantity: 5
            }
          ])

          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
          console.log(res);
    
          expect(warehouse.Inventory['140-800003']).to.be.equal(4995);
          expect(warehouse.Inventory['140-800012']).to.be.equal(4995);
          expect(warehouse.Inventory['140-800018']).to.be.equal(4995);
          expect(warehouse.Inventory['140-800019']).to.be.equal(4995);
          expect(warehouse.Inventory['140-800020']).to.be.equal(4995);
          expect(warehouse.Inventory['140-800021']).to.be.equal(4995);
          expect(warehouse.Inventory['120-996203']).to.be.equal(4995);
          expect(warehouse.Inventory['120-996303']).to.be.equal(4995);
          expect(res.Success).to.be.true;
          expect(res.AllocationAvailability["1"]).to.be.undefined;
        })

        it('Wait 5 minutes', () => sleep(300 * 1000));

        it('Force reset allocaitons', () => apiClient.forceResetAllocations());

        it('Check inventory', async () => {
            const warehouse = await apiClient.getWarehouse(warehouseID);
            console.log(warehouse);
      
            expect(warehouse.Inventory['140-800003']).to.be.equal(4995);
            expect(warehouse.Inventory['140-800012']).to.be.equal(4995);
            expect(warehouse.Inventory['140-800018']).to.be.equal(4995);
            expect(warehouse.Inventory['140-800019']).to.be.equal(4995);
            expect(warehouse.Inventory['140-800020']).to.be.equal(4995);
            expect(warehouse.Inventory['140-800021']).to.be.equal(4995);
            expect(warehouse.Inventory['120-996203']).to.be.equal(4995);
            expect(warehouse.Inventory['120-996303']).to.be.equal(4995);
          })
  

        it('Second order - change qty in package in each item - add 2 qty - after check inventory qty of items should be correct', async () => {
          const res = await apiClient.allocatedOrder(warehouseID, orderID, user1, [
            {
                ItemExternalID: '140-800003',
                UnitsQuantity: 4
            },
            {
                ItemExternalID: '140-800012',
                UnitsQuantity: 4
            },
            {
                ItemExternalID: '140-800018',
                UnitsQuantity: 4
            },
            {
                ItemExternalID: '140-800019',
                UnitsQuantity: 4
            },
            {
                ItemExternalID: '140-800020',
                UnitsQuantity: 4
            },
            {
                ItemExternalID: '140-800021',
                UnitsQuantity: 4
            },
            {
                ItemExternalID: '120-996203',
                UnitsQuantity: 4
            },
            {
                ItemExternalID: '120-996303',
                UnitsQuantity: 4
            }
          ])

          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
          console.log(res);
    
          expect(warehouse.Inventory['140-800003']).to.be.equal(4984);
          expect(warehouse.Inventory['140-800012']).to.be.equal(4984);
          expect(warehouse.Inventory['140-800018']).to.be.equal(4984);
          expect(warehouse.Inventory['140-800019']).to.be.equal(4984);
          expect(warehouse.Inventory['140-800020']).to.be.equal(4984);
          expect(warehouse.Inventory['140-800021']).to.be.equal(4984);
          expect(warehouse.Inventory['120-996203']).to.be.equal(4984);
          expect(warehouse.Inventory['120-996303']).to.be.equal(4984);
          expect(res.Success).to.be.true;
          expect(res.AllocationAvailability["1"]).to.be.undefined;
        })

    })
});

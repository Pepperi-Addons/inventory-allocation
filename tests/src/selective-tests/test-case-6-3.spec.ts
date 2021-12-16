import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("Test case 6/3/21", () => {
    before(() => apiClient.install());

    after(() => apiClient.uninstall());

    describe("Allocation - Pricing Change and approve - CSR Change and Approve", async () => {
        const warehouseID = uuid();
        const orderID = uuid();
        const userMM = uuid();   // MM
        const userJN = uuid();   // JN
        const userKL = uuid();   // KL
        const userCCC = uuid();   // CCC
        const priceManager = uuid();
        const CSR = uuid();
        // var itemsQty = 1;
        // var items: {[k: string]: any} = {};
    
        it('Rebase warehouse', async () => {
            // for (var i = 1; i <= itemsQty; i++) {
            //   var str = i.toString();
            //   items[str] = 5000;
            // }
      
            await apiClient.rebase(warehouseID, {
              '801-620006': 4500,
            });
  
            const warehouse = await apiClient.getWarehouse(warehouseID);
            console.log(warehouse);
        
            expect(warehouse.Inventory['801-620006']).to.be.equal(4500);
            expect(warehouse.UserAllocations).to.be.empty;
        });
    
        it('Allocate user', async () => {
            await apiClient.createUserAllocation(warehouseID, userMM, '801-620006', 500, yesterday(), tomorrow());
            await apiClient.createUserAllocation(warehouseID, userJN, '801-620006', 1000, yesterday(), tomorrow());
            await apiClient.createUserAllocation(warehouseID, userKL, '801-620006', 1000, yesterday(), tomorrow());
            await apiClient.createUserAllocation(warehouseID, userCCC, '801-620006', 1000, yesterday(), tomorrow());
        });
  
        it('Force reset allocaitons', () => apiClient.forceResetAllocations());
  
        it('Check the warehouse', async () => {
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
    
          expect(warehouse.Inventory['801-620006']).to.be.equal(1000);
          expect(warehouse.UserAllocations['801-620006']).to.be.equal(3500);
        })

        it('MM Order 100', async () => {
          const res1 = await apiClient.allocatedOrder(warehouseID, orderID, userMM, [
            {
              ItemExternalID: '801-620006',
              UnitsQuantity: 100
            }
          ])

          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
          console.log(res1);
    
          expect(warehouse.Inventory['801-620006']).to.be.equal(1000);
          expect(warehouse.UserAllocations['801-620006']).to.be.equal(3400);
          expect(res1.Success).to.be.true;
          expect(res1.AllocationAvailability["801-620006"]).to.be.undefined;
        })

        it('Pricing Manager increases the Qty to 200', async () => {
          const res = await apiClient.allocatedOrder(warehouseID, orderID, priceManager, [
            {
              ItemExternalID: '801-620006',
              UnitsQuantity: 200
            }
          ])

          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
          console.log(res);
    
          expect(warehouse.Inventory['801-620006']).to.be.equal(900); 
          expect(warehouse.UserAllocations['801-620006']).to.be.equal(3400); 
          expect(res.Success).to.be.true;
          expect(res.AllocationAvailability["801-620006"]).to.be.undefined;
        })

        it('CSR increases the Qty to 300', async () => {
          const res = await apiClient.allocatedOrder(warehouseID, orderID, CSR, [
            {
              ItemExternalID: '801-620006',
              UnitsQuantity: 300
            }
          ])

          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
          console.log(res);
    
          expect(warehouse.Inventory['801-620006']).to.be.equal(800);
          expect(warehouse.UserAllocations['801-620006']).to.be.equal(3400);
          expect(res.Success).to.be.true;
          expect(res.AllocationAvailability["801-620006"]).to.be.undefined;
        });
    })
});

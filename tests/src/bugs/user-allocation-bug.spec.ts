import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("User Allocation bug", () => {
    before(() => apiClient.install());

    after(() => apiClient.uninstall());

    describe("User Allocation bug - After user used all of allocations, it can user can continuously order as much as they wanted of this item", async () => {
        const warehouseID = uuid();
        const orderId4 = uuid();
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
    
        it('Allocate user', async () => {
            await apiClient.createUserAllocation(warehouseID, user1, '1', 1500, yesterday(), tomorrow());
            await apiClient.createUserAllocation(warehouseID, user2, '1', 1500, yesterday(), tomorrow());
            await apiClient.createUserAllocation(warehouseID, user3, '1', 1500, yesterday(), tomorrow());
            await apiClient.createUserAllocation(warehouseID, user4, '1', 1500, yesterday(), tomorrow());
        });
  
        it('Force reset allocaitons', () => apiClient.forceResetAllocations());
  
        it('Check the warehouse', async () => {
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
    
          expect(warehouse.Inventory['1']).to.be.undefined;
          expect(warehouse.UserAllocations['1']).to.be.equal(5000);
          expect(warehouse.UserAllocations['2']).to.be.undefined;
        })

        it('Initial order - should use all of the userAllocation for three users and should block the last user b/c he have less userallocation than available', async () => {
          const res1 = await apiClient.allocatedOrder(warehouseID, uuid(), user1, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 1500
            }
          ])
          const res2 = await apiClient.allocatedOrder(warehouseID, uuid(), user2, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 1500
            }
          ])
          const res3 = await apiClient.allocatedOrder(warehouseID, uuid(), user3, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 1500
            }
          ])
          const res4 = await apiClient.allocatedOrder(warehouseID, orderId4, user4, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 1500
            }
          ])

          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
          console.log(res1);
          console.log(res2);
          console.log(res3);
          console.log(res4);
    
          expect(warehouse.Inventory['1']).to.be.undefined;
          expect(warehouse.UserAllocations['1']).to.be.undefined;
          expect(res1.Success).to.be.true;
          expect(res1.AllocationAvailability["1"]).to.be.undefined;
          expect(res2.Success).to.be.true;
          expect(res2.AllocationAvailability["1"]).to.be.undefined;
          expect(res3.Success).to.be.true;
          expect(res3.AllocationAvailability["1"]).to.be.undefined;
          expect(res4.Success).to.be.false;
          expect(res4.AllocationAvailability["1"]).to.be.equal(500);
        })

        it('Initial order continue - prossed with available button - changes qty to available qty (500) for the last user and submits the order', async () => {
          const res4 = await apiClient.allocatedOrder(warehouseID, orderId4, user4, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 500
            }
          ])

          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
          console.log(res4);
    
          expect(warehouse.Inventory['1']).to.be.undefined;
          expect(warehouse.UserAllocations['1']).to.be.undefined;
          expect(res4.Success).to.be.true;
          expect(res4.AllocationAvailability["1"]).to.be.undefined;
        })

        it('Check user Allocations - user Allocation for three users should be used and the last one is only used 500 of 1500', async () => {
          const userAllocations = await apiClient.getUserAllocation();
          console.log(userAllocations);

          userAllocations.forEach((el: { [x: string]: any; UserID: string; }) => {
            if (el.UserID == user4) {
              expect(el["UsedAllocation"]).to.be.equal(500);
              expect(el["UsedAllocation"]).to.be.lessThan(el["MaxAllocation"]);
            } else {
              expect(el["UsedAllocation"]).to.be.equal(1500);
              expect(el["UsedAllocation"]).to.be.equal(el["MaxAllocation"]);
            }
          })
        });
        
        it('Second order - inventory is empty but user allocation for the last user is still 1000 qty, trying to order 3000 qty for the last user - should be block', async () => {
          const res = await apiClient.allocatedOrder(warehouseID, uuid(), user4, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 3000
            }
          ])

          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
          console.log(res);
    
          expect(warehouse.Inventory['1']).to.be.undefined;
          expect(warehouse.UserAllocations['1']).to.be.undefined;
          expect(warehouse.UserAllocations['2']).to.be.undefined;
          expect(res.Success).to.be.false;
          expect(res.AllocationAvailability["1"]).to.be.equal(0);
        })

        it('Check user Allocations - nothing should change', async () => {
          const userAllocations = await apiClient.getUserAllocation();

          console.log(userAllocations);
          userAllocations.forEach((el: { [x: string]: any; UserID: string; }) => {
            if (el.UserID == user4) {
              expect(el["UsedAllocation"]).to.be.equal(500);
              expect(el["UsedAllocation"]).to.be.lessThan(el["MaxAllocation"]);
            } else {
              expect(el["UsedAllocation"]).to.be.equal(1500);
              expect(el["UsedAllocation"]).to.be.equal(el["MaxAllocation"]);
            }
          })
        });

        it('Third order - same as second order - should be blocked', async () => {
          const res = await apiClient.allocatedOrder(warehouseID, uuid(), user4, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 10000
            }
          ])

          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
          console.log(res);
    
          expect(warehouse.Inventory['1']).to.be.undefined;
          expect(warehouse.UserAllocations['1']).to.be.undefined;
          expect(warehouse.UserAllocations['2']).to.be.undefined;
          expect(res.Success).to.be.false;
          expect(res.AllocationAvailability["1"]).to.be.equal(0);
        })

        it('Check user Allocations - used allocation should be increased', async () => {
          const userAllocations = await apiClient.getUserAllocation();

          console.log(userAllocations);
          userAllocations.forEach((el: { [x: string]: any; UserID: string; }) => {
            if (el.UserID == user4) {
              expect(el["UsedAllocation"]).to.be.equal(500);
              expect(el["UsedAllocation"]).to.be.lessThan(el["MaxAllocation"]);
            } else {
              expect(el["UsedAllocation"]).to.be.equal(1500);
              expect(el["UsedAllocation"]).to.be.equal(el["MaxAllocation"]);
            }
          })
        });
    })
});

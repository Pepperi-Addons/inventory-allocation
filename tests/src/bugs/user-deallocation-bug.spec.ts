import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("User Allocation bugs", () => {
    before(() => apiClient.install());

    after(() => apiClient.uninstall());

    describe("User Allocation bug - Create allocation for 4 users, after some time, deallocate one of the users, inventory should be correct", async () => {
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
            items[str] = 403;
          }
    
          await apiClient.rebase(warehouseID, items);

          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
      
          expect(warehouse.Inventory['1']).to.be.equal(403);
          expect(warehouse.UserAllocations).to.be.empty;
      });
  
      it('Allocate user', async () => {
          await apiClient.createUserAllocation(warehouseID, user1, '1', 100, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, user2, '1', 100, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, user3, '1', 100, yesterday(), tomorrow());
          await apiClient.createUserAllocation(warehouseID, user4, '1', 100, yesterday(), tomorrow());
      });

      it('Force reset allocaitons', () => apiClient.forceResetAllocations());

      it('Check the warehouse', async () => {
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
  
        expect(warehouse.Inventory['1']).to.be.equal(3);
        expect(warehouse.UserAllocations['1']).to.be.equal(400);
      })


      it('Deallocate one user', async () => {
        await apiClient.createUserAllocation(warehouseID, user4, '1', 100, yesterday(), yesterday());
      });

      it('Force reset allocaitons', () => apiClient.forceResetAllocations());

      it('Check the warehouse and user allocations', async () => {
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
  
        expect(warehouse.Inventory['1']).to.be.equal(103);
        expect(warehouse.UserAllocations['1']).to.be.equal(300);
      })
  })

    describe("User Allocation bug - Create allocation for 4 users, after some time, deallocate one of the users, then another one, inventory should be correct", async () => {
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
              items[str] = 500;
            }
      
            await apiClient.rebase(warehouseID, items);
  
            const warehouse = await apiClient.getWarehouse(warehouseID);
            console.log(warehouse);
        
            expect(warehouse.Inventory['1']).to.be.equal(500);
            expect(warehouse.UserAllocations).to.be.empty;
        });
    
        it('Allocate user', async () => {
            await apiClient.createUserAllocation(warehouseID, user1, '1', 150, yesterday(), tomorrow());
            await apiClient.createUserAllocation(warehouseID, user2, '1', 150, yesterday(), tomorrow());
            await apiClient.createUserAllocation(warehouseID, user3, '1', 150, yesterday(), tomorrow());
            await apiClient.createUserAllocation(warehouseID, user4, '1', 150, yesterday(), tomorrow());
        });
  
        it('Force reset allocaitons', () => apiClient.forceResetAllocations());
  
        it('Check the warehouse', async () => {
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
    
          expect(warehouse.Inventory['1']).to.be.undefined;
          expect(warehouse.UserAllocations['1']).to.be.equal(500);
        })

        it('Order from the first and the second users', async () => {
          const res = await apiClient.allocatedOrder(warehouseID, uuid(), user1, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 150
            }
          ])  

          const res2 = await apiClient.allocatedOrder(warehouseID, uuid(), user2, [
            {
              ItemExternalID: '1',
              UnitsQuantity: 150
            }
          ])  
          
          const warehouse = await apiClient.getWarehouse(warehouseID);
          console.log(warehouse);
          console.log(res);
          console.log(res2);
          
          expect(warehouse.Inventory['1']).to.be.undefined;
          expect(warehouse.UserAllocations['1']).to.be.equal(200);
          expect(res.Success).to.be.true;
          expect(res2.Success).to.be.true;
        })

        it('Deallocate one user', async () => {
          await apiClient.createUserAllocation(warehouseID, user2, '1', 150, yesterday(), yesterday());
        });

        it('Force reset allocaitons', () => apiClient.forceResetAllocations());

        it('Check the warehouse and user allocations', async () => {
          const warehouse = await apiClient.getWarehouse(warehouseID);
          const userAllocations = await apiClient.getUserAllocation()
          console.log(warehouse);
          console.log(userAllocations);
    
          expect(warehouse.Inventory['1']).to.be.undefined;
          expect(warehouse.UserAllocations['1']).to.be.equal(200);
          userAllocations.forEach((element: any) => {
            if (element.UserID == user2)
              expect(element.Allocated).to.be.false;
          });
        })
        
        it('Deallocate another user', async () => {
          await apiClient.createUserAllocation(warehouseID, user3, '1', 150, yesterday(), yesterday());
        });

        it('Force reset allocaitons', () => apiClient.forceResetAllocations());

        it('Check the warehouse', async () => {
          const warehouse = await apiClient.getWarehouse(warehouseID);
          const userAllocations = await apiClient.getUserAllocation()
          console.log(warehouse);
          console.log(userAllocations);

          expect(warehouse.Inventory['1']).to.be.equal(50);
          expect(warehouse.UserAllocations['1']).to.be.equal(150);
          userAllocations.forEach((element: any) => {
            if (element.UserID == user3)
              expect(element.Allocated).to.be.false;
          });
        })
    })
});

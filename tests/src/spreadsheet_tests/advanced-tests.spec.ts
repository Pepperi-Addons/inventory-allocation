import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("User-specific + BOGO/BOGA tests from spreadsheet", () => {
    before(() => apiClient.install());

    after(() => apiClient.uninstall());

    describe("33 case - basic - with sufficient qty", async () => {
      const warehouseID = uuid();
      const orderID = uuid();
      const user = uuid();
      var itemsQty = 10;
      var items: {[k: string]: any} = {};

      it('Rebase warehouse', async () => {
        for (var i = 1; i <= itemsQty; i++) {
          var str = i.toString();
          items[str] = 600;
        }
  
        await apiClient.rebase(warehouseID, items);
    
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
    
        expect(warehouse.Inventory['1']).to.be.equal(600);
        expect(warehouse.Inventory['2']).to.be.equal(600);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations).to.be.empty;
      });

      it('Allocate user', async () => {
        await apiClient.createUserAllocation(warehouseID, user, '1', 300, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user, '2', 300, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user, '3', 300, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user, '4', 300, yesterday(), tomorrow());
      });

      it('Force reset allocaitons', () => apiClient.forceResetAllocations());

      it('Check the the warehouse', async () => {
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
  
        expect(warehouse.Inventory['1']).to.be.equal(300);
        expect(warehouse.Inventory['2']).to.be.equal(300);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(300);
        expect(warehouse.Inventory['8']).to.be.equal(600);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations['1']).to.be.equal(300);
        expect(warehouse.UserAllocations['2']).to.be.equal(300);
        expect(warehouse.UserAllocations['3']).to.be.equal(300);
        expect(warehouse.UserAllocations['4']).to.be.equal(300);
      })

      it('Initial submit - order 100 of the BOGO item #1, order 200 of the BOGA item #2 + order 100 of the item #3, order 100 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 100
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 100
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 200
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 100
          },            
          {
            ItemExternalID: '4',
            UnitsQuantity: 100
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(300);
        expect(warehouse.Inventory['2']).to.be.equal(300);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(300);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations['1']).to.be.equal(100);
        expect(warehouse.UserAllocations['2']).to.be.equal(100);
        expect(warehouse.UserAllocations['3']).to.be.equal(200);
        expect(warehouse.UserAllocations['4']).to.be.equal(200);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
      });
    })

    describe("34 case - modification qty - with sufficient qty", async () => {
      const warehouseID = uuid();
      const orderID = uuid();
      const user = uuid();
      var itemsQty = 10;
      var items: {[k: string]: any} = {};

      it('Rebase warehouse', async () => {
        for (var i = 1; i <= itemsQty; i++) {
          var str = i.toString();
          items[str] = 600;
        }
  
        await apiClient.rebase(warehouseID, items);
    
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
    
        expect(warehouse.Inventory['1']).to.be.equal(600);
        expect(warehouse.Inventory['2']).to.be.equal(600);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations).to.be.empty;
      });

      it('Allocate user', async () => {
        await apiClient.createUserAllocation(warehouseID, user, '1', 300, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user, '2', 300, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user, '3', 300, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user, '4', 300, yesterday(), tomorrow());
      });

      it('Force reset allocaitons', () => apiClient.forceResetAllocations());

      it('Check the the warehouse', async () => {
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
  
        expect(warehouse.Inventory['1']).to.be.equal(300);
        expect(warehouse.Inventory['2']).to.be.equal(300);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(300);
        expect(warehouse.Inventory['8']).to.be.equal(600);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations['1']).to.be.equal(300);
        expect(warehouse.UserAllocations['2']).to.be.equal(300);
        expect(warehouse.UserAllocations['3']).to.be.equal(300);
        expect(warehouse.UserAllocations['4']).to.be.equal(300);
      })

      it('Initial submit - order 100 of the BOGO item #1, order 200 of the BOGA item #2 + order 100 of the item #3, order 100 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 100
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 100
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 200
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 100
          },            
          {
            ItemExternalID: '4',
            UnitsQuantity: 100
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(300);
        expect(warehouse.Inventory['2']).to.be.equal(300);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(300);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations['1']).to.be.equal(100);
        expect(warehouse.UserAllocations['2']).to.be.equal(100);
        expect(warehouse.UserAllocations['3']).to.be.equal(200);
        expect(warehouse.UserAllocations['4']).to.be.equal(200);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
      });

      it('Second submit - change+ qty - change 125 of the BOGO item #1, order 250 of the BOGA item #2 + order 150 of the item #3, order 250 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 125
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 125
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 250
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 150
          },            
          {
            ItemExternalID: '4',
            UnitsQuantity: 250
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(300);
        expect(warehouse.Inventory['2']).to.be.equal(300);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(300);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations['1']).to.be.equal(50);
        expect(warehouse.UserAllocations['2']).to.be.equal(50);
        expect(warehouse.UserAllocations['3']).to.be.equal(150);
        expect(warehouse.UserAllocations['4']).to.be.equal(50);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
      });

      it('Third submit - change- qty - change 50 of the BOGO item #1, order 100 of the BOGA item #2 + order 50 of the item #3, order 25 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 50
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 50
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 100
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 50
          },            
          {
            ItemExternalID: '4',
            UnitsQuantity: 25
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(300);
        expect(warehouse.Inventory['2']).to.be.equal(300);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(300);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations['1']).to.be.equal(200);
        expect(warehouse.UserAllocations['2']).to.be.equal(200);
        expect(warehouse.UserAllocations['3']).to.be.equal(250);
        expect(warehouse.UserAllocations['4']).to.be.equal(275);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
      });

    })

    describe("35 case - cancel - with sufficient qty", async () => {
      const warehouseID = uuid();
      const orderID = uuid();
      const user = uuid();
      var itemsQty = 10;
      var items: {[k: string]: any} = {};

      it('Rebase warehouse', async () => {
        for (var i = 1; i <= itemsQty; i++) {
          var str = i.toString();
          items[str] = 600;
        }
  
        await apiClient.rebase(warehouseID, items);
    
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
    
        expect(warehouse.Inventory['1']).to.be.equal(600);
        expect(warehouse.Inventory['2']).to.be.equal(600);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations).to.be.empty;
      });

      it('Allocate user', async () => {
        await apiClient.createUserAllocation(warehouseID, user, '1', 300, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user, '2', 300, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user, '3', 300, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user, '4', 300, yesterday(), tomorrow());
      });

      it('Force reset allocaitons', () => apiClient.forceResetAllocations());

      it('Check the the warehouse', async () => {
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
  
        expect(warehouse.Inventory['1']).to.be.equal(300);
        expect(warehouse.Inventory['2']).to.be.equal(300);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(300);
        expect(warehouse.Inventory['8']).to.be.equal(600);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations['1']).to.be.equal(300);
        expect(warehouse.UserAllocations['2']).to.be.equal(300);
        expect(warehouse.UserAllocations['3']).to.be.equal(300);
        expect(warehouse.UserAllocations['4']).to.be.equal(300);
      })

      it('Initial submit - order 100 of the BOGO item #1, order 200 of the BOGA item #2 + order 100 of the item #3, order 100 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 100
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 100
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 200
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 100
          },            
          {
            ItemExternalID: '4',
            UnitsQuantity: 100
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(300);
        expect(warehouse.Inventory['2']).to.be.equal(300);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(300);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations['1']).to.be.equal(100);
        expect(warehouse.UserAllocations['2']).to.be.equal(100);
        expect(warehouse.UserAllocations['3']).to.be.equal(200);
        expect(warehouse.UserAllocations['4']).to.be.equal(200);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
      });

      it('Cancel order - change to 0 all of the items - using UserAlloc and Inventory qty - should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 0
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 0
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 0
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 0
          },            
          {
            ItemExternalID: '4',
            UnitsQuantity: 0
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(300);
        expect(warehouse.Inventory['2']).to.be.equal(300);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(300);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations['1']).to.be.equal(300);
        expect(warehouse.UserAllocations['2']).to.be.equal(300);
        expect(warehouse.UserAllocations['3']).to.be.equal(300);
        expect(warehouse.UserAllocations['4']).to.be.equal(300);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
      });

    })

    describe("36 case - basic - with insufficient qty", async () => {
      const warehouseID = uuid();
      const orderID = uuid();
      const user = uuid();
      var itemsQty = 10;
      var items: {[k: string]: any} = {};

      it('Rebase warehouse', async () => {
        for (var i = 1; i <= itemsQty; i++) {
          var str = i.toString();
          items[str] = 600;
        }
  
        await apiClient.rebase(warehouseID, items);
    
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
    
        expect(warehouse.Inventory['1']).to.be.equal(600);
        expect(warehouse.Inventory['2']).to.be.equal(600);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations).to.be.empty;
      });

      it('Allocate user', async () => {
        await apiClient.createUserAllocation(warehouseID, user, '1', 300, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user, '2', 300, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user, '3', 300, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user, '4', 300, yesterday(), tomorrow());
      });

      it('Force reset allocaitons', () => apiClient.forceResetAllocations());

      it('Check the the warehouse', async () => {
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
  
        expect(warehouse.Inventory['1']).to.be.equal(300);
        expect(warehouse.Inventory['2']).to.be.equal(300);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(300);
        expect(warehouse.Inventory['8']).to.be.equal(600);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations['1']).to.be.equal(300);
        expect(warehouse.UserAllocations['2']).to.be.equal(300);
        expect(warehouse.UserAllocations['3']).to.be.equal(300);
        expect(warehouse.UserAllocations['4']).to.be.equal(300);
      })

      it('Initial submit - order 500 of the BOGO item #1, order 600 of the BOGA item #2 + order 900 of the item #3, order 800 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 500
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 500
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 620
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 900
          },            
          {
            ItemExternalID: '4',
            UnitsQuantity: 800
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(0);
        expect(warehouse.Inventory['2']).to.be.equal(0);
        expect(warehouse.Inventory['3']).to.be.equal(0);
        expect(warehouse.Inventory['4']).to.be.equal(0);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations['1']).to.be.undefined;
        expect(warehouse.UserAllocations['2']).to.be.undefined;
        expect(warehouse.UserAllocations['3']).to.be.undefined;
        expect(warehouse.UserAllocations['4']).to.be.undefined;
        expect(res.Success).to.be.false;
        expect(res.AllocationAvailability['1']).to.be.equal(600);
        expect(res.AllocationAvailability['2']).to.be.equal(600);
        expect(res.AllocationAvailability['3']).to.be.equal(600);
        expect(res.AllocationAvailability['4']).to.be.equal(600);
      });
    })

    describe("37 case - modification qty  - with insufficient qty", async () => {
      const warehouseID = uuid();
      const orderID = uuid();
      const user = uuid();
      var itemsQty = 10;
      var items: {[k: string]: any} = {};

      it('Rebase warehouse', async () => {
        for (var i = 1; i <= itemsQty; i++) {
          var str = i.toString();
          items[str] = 600;
        }
  
        await apiClient.rebase(warehouseID, items);
    
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
    
        expect(warehouse.Inventory['1']).to.be.equal(600);
        expect(warehouse.Inventory['2']).to.be.equal(600);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations).to.be.empty;
      });

      it('Allocate user', async () => {
        await apiClient.createUserAllocation(warehouseID, user, '1', 300, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user, '2', 300, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user, '3', 300, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user, '4', 300, yesterday(), tomorrow());
      });

      it('Force reset allocaitons', () => apiClient.forceResetAllocations());

      it('Check the the warehouse', async () => {
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
  
        expect(warehouse.Inventory['1']).to.be.equal(300);
        expect(warehouse.Inventory['2']).to.be.equal(300);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(300);
        expect(warehouse.Inventory['8']).to.be.equal(600);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations['1']).to.be.equal(300);
        expect(warehouse.UserAllocations['2']).to.be.equal(300);
        expect(warehouse.UserAllocations['3']).to.be.equal(300);
        expect(warehouse.UserAllocations['4']).to.be.equal(300);
      })

      it('Initial submit - order 100 of the BOGO item #1, order 200 of the BOGA item #2 + order 100 of the item #3, order 100 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 100
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 100
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 200
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 100
          },            
          {
            ItemExternalID: '4',
            UnitsQuantity: 100
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(300);
        expect(warehouse.Inventory['2']).to.be.equal(300);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(300);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations['1']).to.be.equal(100);
        expect(warehouse.UserAllocations['2']).to.be.equal(100);
        expect(warehouse.UserAllocations['3']).to.be.equal(200);
        expect(warehouse.UserAllocations['4']).to.be.equal(200);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
      });

      it('Second submit - change+ qty - change 125 of the BOGO item #1, order 250 of the BOGA item #2 + order 150 of the item #3, order 250 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 125
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 125
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 250
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 150
          },            
          {
            ItemExternalID: '4',
            UnitsQuantity: 250
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(300);
        expect(warehouse.Inventory['2']).to.be.equal(300);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(300);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations['1']).to.be.equal(50);
        expect(warehouse.UserAllocations['2']).to.be.equal(50);
        expect(warehouse.UserAllocations['3']).to.be.equal(150);
        expect(warehouse.UserAllocations['4']).to.be.equal(50);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
      });

      it('Third submit - change- qty - change 50 of the BOGO item #1, order 100 of the BOGA item #2 + order 50 of the item #3, order 25 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 50
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 50
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 100
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 50
          },            
          {
            ItemExternalID: '4',
            UnitsQuantity: 25
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(300);
        expect(warehouse.Inventory['2']).to.be.equal(300);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(300);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations['1']).to.be.equal(200);
        expect(warehouse.UserAllocations['2']).to.be.equal(200);
        expect(warehouse.UserAllocations['3']).to.be.equal(250);
        expect(warehouse.UserAllocations['4']).to.be.equal(275);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
      });

    })

    describe("38 case - cancel - with insufficient qty", async () => {
      const warehouseID = uuid();
      const orderID = uuid();
      const user = uuid();
      var itemsQty = 10;
      var items: {[k: string]: any} = {};

      it('Rebase warehouse', async () => {
        for (var i = 1; i <= itemsQty; i++) {
          var str = i.toString();
          items[str] = 600;
        }
  
        await apiClient.rebase(warehouseID, items);
    
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
    
        expect(warehouse.Inventory['1']).to.be.equal(600);
        expect(warehouse.Inventory['2']).to.be.equal(600);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations).to.be.empty;
      });

      it('Allocate user', async () => {
        await apiClient.createUserAllocation(warehouseID, user, '1', 300, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user, '2', 300, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user, '3', 300, yesterday(), tomorrow());
        await apiClient.createUserAllocation(warehouseID, user, '4', 300, yesterday(), tomorrow());
      });

      it('Force reset allocaitons', () => apiClient.forceResetAllocations());

      it('Check the the warehouse', async () => {
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
  
        expect(warehouse.Inventory['1']).to.be.equal(300);
        expect(warehouse.Inventory['2']).to.be.equal(300);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(300);
        expect(warehouse.Inventory['8']).to.be.equal(600);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations['1']).to.be.equal(300);
        expect(warehouse.UserAllocations['2']).to.be.equal(300);
        expect(warehouse.UserAllocations['3']).to.be.equal(300);
        expect(warehouse.UserAllocations['4']).to.be.equal(300);
      })

      it('Initial submit - order 100 of the BOGO item #1, order 200 of the BOGA item #2 + order 100 of the item #3, order 100 of the item #4 - using UserAlloc and Inventory qty - should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 100
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 100
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 200
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 100
          },            
          {
            ItemExternalID: '4',
            UnitsQuantity: 100
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(300);
        expect(warehouse.Inventory['2']).to.be.equal(300);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(300);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations['1']).to.be.equal(100);
        expect(warehouse.UserAllocations['2']).to.be.equal(100);
        expect(warehouse.UserAllocations['3']).to.be.equal(200);
        expect(warehouse.UserAllocations['4']).to.be.equal(200);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
      });

      it('Cancel order - change to 0 all of the items - using UserAlloc and Inventory qty - should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 0
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 0
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 0
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 0
          },            
          {
            ItemExternalID: '4',
            UnitsQuantity: 0
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(300);
        expect(warehouse.Inventory['2']).to.be.equal(300);
        expect(warehouse.Inventory['3']).to.be.equal(300);
        expect(warehouse.Inventory['4']).to.be.equal(300);
        expect(warehouse.Inventory['9']).to.be.equal(600);
        expect(warehouse.Inventory['10']).to.be.equal(600);
        expect(warehouse.UserAllocations['1']).to.be.equal(300);
        expect(warehouse.UserAllocations['2']).to.be.equal(300);
        expect(warehouse.UserAllocations['3']).to.be.equal(300);
        expect(warehouse.UserAllocations['4']).to.be.equal(300);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
      });

    })
  });  
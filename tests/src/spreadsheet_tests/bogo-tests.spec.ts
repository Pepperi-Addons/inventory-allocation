import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("BOGO tests from spreadsheet", () => {
    before(() => apiClient.install());

    after(() => apiClient.uninstall());

    describe("19 case - basic - with sufficient qty", async () => {
      const warehouseID = uuid();
      const orderID = uuid();
      const user = uuid();
      var itemsQty = 10;
      var items: {[k: string]: any} = {};

      it('Rebase warehouse', async () => {
        for (var i = 1; i <= itemsQty; i++) {
          var str = i.toString();
          items[str] = 100;
        }
  
        await apiClient.rebase(warehouseID, items);
    
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
    
        expect(warehouse.Inventory['1']).to.be.equal(100);
        expect(warehouse.Inventory['2']).to.be.equal(100);
        expect(warehouse.Inventory['9']).to.be.equal(100);
        expect(warehouse.Inventory['10']).to.be.equal(100);
        expect(warehouse.UserAllocations).to.be.empty;
      });

      it('Initial submit - order 20 of the BOGO item #1, 30 of the BOGO item #2, 25 of the BOGO item #3 - all should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 30
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 30
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 25
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 25
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 25
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(60);
        expect(warehouse.Inventory['2']).to.be.equal(40);
        expect(warehouse.Inventory['3']).to.be.equal(25);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['3']).to.be.undefined;
      });

    })

    describe("20 case - modification qty - with sufficient qty", async () => {
      const warehouseID = uuid();
      const orderID = uuid();
      const user = uuid();
      var itemsQty = 10;
      var items: {[k: string]: any} = {};

      it('Rebase warehouse', async () => {
        for (var i = 1; i <= itemsQty; i++) {
          var str = i.toString();
          items[str] = 100;
        }
  
        await apiClient.rebase(warehouseID, items);
    
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
    
        expect(warehouse.Inventory['1']).to.be.equal(100);
        expect(warehouse.Inventory['2']).to.be.equal(100);
        expect(warehouse.Inventory['9']).to.be.equal(100);
        expect(warehouse.Inventory['10']).to.be.equal(100);
        expect(warehouse.UserAllocations).to.be.empty;
      });

      it('Initial submit - order 20 of the item #1, 30 of the item #2, 25 of the item #3, 15 of the item #4 - all should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 30
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 30
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 25
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 25
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 25
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 15
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 15
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 15
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 15
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(60);
        expect(warehouse.Inventory['2']).to.be.equal(40);
        expect(warehouse.Inventory['3']).to.be.equal(25);
        expect(warehouse.Inventory['4']).to.be.equal(40);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
      });

      it('Second submit - change+ qty - change 40 of the item #1, 35 of the item #2, 30 of the item #3, 20 of the item #4 - all should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 40
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 40
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 35
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 35
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 30
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 30
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 30
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 20
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log("Res - ", res);
    
        expect(warehouse.Inventory['1']).to.be.equal(20);
        expect(warehouse.Inventory['2']).to.be.equal(30);
        expect(warehouse.Inventory['3']).to.be.equal(10);
        expect(warehouse.Inventory['4']).to.be.equal(20);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
      });

      it('Third submit - change- qty - change 10 of the item #1, 20 of the item #2, 15 of the item #3, 5 of the item #4 - all should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 10
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 10
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 15
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 15
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 15
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 5
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 5
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 5
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 5
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log("Res - ", res);
    
        expect(warehouse.Inventory['1']).to.be.equal(80);
        expect(warehouse.Inventory['2']).to.be.equal(60);
        expect(warehouse.Inventory['3']).to.be.equal(55);
        expect(warehouse.Inventory['4']).to.be.equal(80);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
      });
    })

    describe("21 case - cancel - with sufficient qty", async () => {
      const warehouseID = uuid();
      const orderID = uuid();
      const user = uuid();
      var itemsQty = 10;
      var items: {[k: string]: any} = {};

      it('Rebase warehouse', async () => {
        for (var i = 1; i <= itemsQty; i++) {
          var str = i.toString();
          items[str] = 100;
        }
  
        await apiClient.rebase(warehouseID, items);
    
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
    
        expect(warehouse.Inventory['1']).to.be.equal(100);
        expect(warehouse.Inventory['2']).to.be.equal(100);
        expect(warehouse.Inventory['9']).to.be.equal(100);
        expect(warehouse.Inventory['10']).to.be.equal(100);
        expect(warehouse.UserAllocations).to.be.empty;
      });

      it('Initial submit - order 20 of the item #1, 30 of the item #2, 25 of the item #3, 15 of the item #4 - all should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 30
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 30
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 25
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 25
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 25
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 15
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 15
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 15
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 15
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log("Res - ", res);
    
        expect(warehouse.Inventory['1']).to.be.equal(60);
        expect(warehouse.Inventory['2']).to.be.equal(40);
        expect(warehouse.Inventory['3']).to.be.equal(25);
        expect(warehouse.Inventory['4']).to.be.equal(40);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
      });

      it('Second submit - change+ qty - change 40 of the item #1, 35 of the item #2, 30 of the item #3, 20 of the item #4 - all should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 40
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 40
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 35
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 35
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 30
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 30
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 30
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 20
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log("Res - ", res);
    
        expect(warehouse.Inventory['1']).to.be.equal(20);
        expect(warehouse.Inventory['2']).to.be.equal(30);
        expect(warehouse.Inventory['3']).to.be.equal(10);
        expect(warehouse.Inventory['4']).to.be.equal(20);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
      });

      it('Cancel submit - change qty 0 of the item #1, 0 of the item #2, 0 of the item #3, 0 of the item #4 - return Inventory qty - all should success', async () => {        
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
            ItemExternalID: '2',
            UnitsQuantity: 0
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 0
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 0
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 0
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 0
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 0
          },
          {
            ItemExternalID: '4',
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
    
        expect(warehouse.Inventory['1']).to.be.equal(100);
        expect(warehouse.Inventory['2']).to.be.equal(100);
        expect(warehouse.Inventory['3']).to.be.equal(100);
        expect(warehouse.Inventory['4']).to.be.equal(100);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['3']).to.be.undefined;
        expect(res.AllocationAvailability['4']).to.be.undefined;
      });

    })

    describe("22 case - basic - with insufficient qty", async () => {
      const warehouseID = uuid();
      const orderID = uuid();
      const user = uuid();
      var itemsQty = 10;
      var items: {[k: string]: any} = {};

      it('Rebase warehouse', async () => {
        for (var i = 1; i <= itemsQty; i++) {
          var str = i.toString();
          items[str] = 100;
        }
  
        await apiClient.rebase(warehouseID, items);
    
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
    
        expect(warehouse.Inventory['1']).to.be.equal(100);
        expect(warehouse.Inventory['2']).to.be.equal(100);
        expect(warehouse.Inventory['9']).to.be.equal(100);
        expect(warehouse.Inventory['10']).to.be.equal(100);
        expect(warehouse.UserAllocations).to.be.empty;
      });

      it('Initial submit - order 60 of the BOGO item #1 and 90 of the BOGO item #2 - both should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 60
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 60
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 90
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 90
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.undefined;
        expect(warehouse.Inventory['2']).to.be.undefined;
        expect(res.Success).to.be.false;
        expect(res.AllocationAvailability['1']).to.be.equal(100);
        expect(res.AllocationAvailability['2']).to.be.equal(100);
      });

    })

    describe("23 case - modification qty - with insufficient qty", async () => {
      const warehouseID = uuid();
      const orderID = uuid();
      const user = uuid();
      var itemsQty = 10;
      var items: {[k: string]: any} = {};

      it('Rebase warehouse', async () => {
        for (var i = 1; i <= itemsQty; i++) {
          var str = i.toString();
          items[str] = 100;
        }
  
        await apiClient.rebase(warehouseID, items);
    
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
    
        expect(warehouse.Inventory['1']).to.be.equal(100);
        expect(warehouse.Inventory['2']).to.be.equal(100);
        expect(warehouse.Inventory['9']).to.be.equal(100);
        expect(warehouse.Inventory['10']).to.be.equal(100);
        expect(warehouse.UserAllocations).to.be.empty;
      });

      it('Initial submit - order 60 of the BOGO item #1 and 90 of the BOGO item #2 - both should blocked with TempAlloc as 100', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 60
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 60
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 90
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 90
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.undefined;
        expect(warehouse.Inventory['2']).to.be.undefined;
        expect(res.Success).to.be.false;
        expect(res.AllocationAvailability['1']).to.be.equal(100);
        expect(res.AllocationAvailability['2']).to.be.equal(100);
      });

      it('Second submit - change+ qty - change 80 of the item #1, 100 of the item #2 - all should be blocked with TempAlloc as 100', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 80
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 80
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 100
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 100
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log("Res - ", res);
    
        expect(warehouse.Inventory['1']).to.be.undefined;
        expect(warehouse.Inventory['2']).to.be.undefined;
        expect(res.Success).to.be.false;
        expect(res.AllocationAvailability['1']).to.be.equal(100);
        expect(res.AllocationAvailability['2']).to.be.equal(100);
      });

      it('Third submit - change- qty - change 55 of the item #1, 75 of the item #2 - all should blocked with TempAlloc as 100', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 55
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 55
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 75
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 75
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log("Res - ", res);
    
        expect(warehouse.Inventory['1']).to.be.undefined;
        expect(warehouse.Inventory['2']).to.be.undefined;
        expect(res.Success).to.be.false;
        expect(res.AllocationAvailability['1']).to.be.equal(100);
        expect(res.AllocationAvailability['2']).to.be.equal(100);
      });
    })

    describe("24 case - cancel - with insufficient qty", async () => {
      const warehouseID = uuid();
      const orderID = uuid();
      const user = uuid();
      var itemsQty = 10;
      var items: {[k: string]: any} = {};

      it('Rebase warehouse', async () => {
        for (var i = 1; i <= itemsQty; i++) {
          var str = i.toString();
          items[str] = 100;
        }
  
        await apiClient.rebase(warehouseID, items);
    
        const warehouse = await apiClient.getWarehouse(warehouseID);
        console.log(warehouse);
    
        expect(warehouse.Inventory['1']).to.be.equal(100);
        expect(warehouse.Inventory['2']).to.be.equal(100);
        expect(warehouse.Inventory['9']).to.be.equal(100);
        expect(warehouse.Inventory['10']).to.be.equal(100);
        expect(warehouse.UserAllocations).to.be.empty;
      });

      it('Initial submit - order 60 of the BOGO item #1 and 90 of the BOGO item #2 - both should blocked', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 60
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 60
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 90
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 90
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log("Res - ", res);
    
        expect(warehouse.Inventory['1']).to.be.undefined;
        expect(warehouse.Inventory['2']).to.be.undefined;
        expect(res.Success).to.be.false;
        expect(res.AllocationAvailability['1']).to.be.equal(100);
        expect(res.AllocationAvailability['2']).to.be.equal(100);
      });

      it('Second submit - change+ qty - change 80 of the item #1, 100 of the item #2 - all should be blocked', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 80
          },
          {
            ItemExternalID: '1',
            UnitsQuantity: 80
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 100
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 100
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log("Res - ", res);
    
        expect(warehouse.Inventory['1']).to.be.undefined;
        expect(warehouse.Inventory['2']).to.be.undefined;
        expect(res.Success).to.be.false;
        expect(res.AllocationAvailability['1']).to.be.equal(100);
        expect(res.AllocationAvailability['2']).to.be.equal(100);
      });

      it('Cancel submit - change qty 0 of the item #1, 0 of the item #2 - return Inventory qty - all should success', async () => {        
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
            ItemExternalID: '2',
            UnitsQuantity: 0
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(100);
        expect(warehouse.Inventory['2']).to.be.equal(100);
        expect(warehouse.Inventory['3']).to.be.equal(100);
        expect(warehouse.Inventory['4']).to.be.equal(100);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['3']).to.be.undefined;
        expect(res.AllocationAvailability['4']).to.be.undefined;
      });

    })

  }); 
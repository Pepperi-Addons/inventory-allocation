import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("BOGA tests from spreadsheet", () => {
    before(() => apiClient.install());

    after(() => apiClient.uninstall());

    describe("25 case - basic - with sufficient qty", async () => {
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

      it('Initial submit - order 5 of the item #1, 10 of the item #2, 15 of the item #3, 20 of the item #4, 25 of the item #5, 30 of the item #6, 35 of the item #7, 40 of the item #8 - all should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 5
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 10
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 15
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '5',
            UnitsQuantity: 25
          },
          {
            ItemExternalID: '6',
            UnitsQuantity: 30
          },
          {
            ItemExternalID: '7',
            UnitsQuantity: 35
          },
          {
            ItemExternalID: '8',
            UnitsQuantity: 40
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(95);
        expect(warehouse.Inventory['2']).to.be.equal(90);
        expect(warehouse.Inventory['3']).to.be.equal(85);
        expect(warehouse.Inventory['4']).to.be.equal(80);
        expect(warehouse.Inventory['5']).to.be.equal(75);
        expect(warehouse.Inventory['6']).to.be.equal(70);
        expect(warehouse.Inventory['7']).to.be.equal(65);
        expect(warehouse.Inventory['8']).to.be.equal(60);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['3']).to.be.undefined;
        expect(res.AllocationAvailability['4']).to.be.undefined;
        expect(res.AllocationAvailability['5']).to.be.undefined;
        expect(res.AllocationAvailability['6']).to.be.undefined;
        expect(res.AllocationAvailability['7']).to.be.undefined;
        expect(res.AllocationAvailability['8']).to.be.undefined;
      });

    })

    describe("26 case - modification qty - with sufficient qty", async () => {
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

      it('Initial submit - order 5 of the item #1, 10 of the item #2, 15 of the item #3, 20 of the item #4, 25 of the item #5, 30 of the item #6, 35 of the item #7, 40 of the item #8 - all should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 5
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 10
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 15
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '5',
            UnitsQuantity: 25
          },
          {
            ItemExternalID: '6',
            UnitsQuantity: 30
          },
          {
            ItemExternalID: '7',
            UnitsQuantity: 35
          },
          {
            ItemExternalID: '8',
            UnitsQuantity: 40
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(95);
        expect(warehouse.Inventory['2']).to.be.equal(90);
        expect(warehouse.Inventory['3']).to.be.equal(85);
        expect(warehouse.Inventory['4']).to.be.equal(80);
        expect(warehouse.Inventory['5']).to.be.equal(75);
        expect(warehouse.Inventory['6']).to.be.equal(70);
        expect(warehouse.Inventory['7']).to.be.equal(65);
        expect(warehouse.Inventory['8']).to.be.equal(60);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['3']).to.be.undefined;
        expect(res.AllocationAvailability['4']).to.be.undefined;
        expect(res.AllocationAvailability['5']).to.be.undefined;
        expect(res.AllocationAvailability['6']).to.be.undefined;
        expect(res.AllocationAvailability['7']).to.be.undefined;
        expect(res.AllocationAvailability['8']).to.be.undefined;
      });

      it('Second submit - change+ qty - change 10 of the item #1, 15 of the item #2, 20 of the item #3, 25 of the item #4, 30 of the item #5, 35 of the item #6, 40 of the item #7, 45 of the item #8 - all should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 10
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 15
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 25
          },
          {
            ItemExternalID: '5',
            UnitsQuantity: 30
          },
          {
            ItemExternalID: '6',
            UnitsQuantity: 35
          },
          {
            ItemExternalID: '7',
            UnitsQuantity: 40
          },
          {
            ItemExternalID: '8',
            UnitsQuantity: 45
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log("Res - ", res);
    
        expect(warehouse.Inventory['1']).to.be.equal(90);
        expect(warehouse.Inventory['2']).to.be.equal(85);
        expect(warehouse.Inventory['3']).to.be.equal(80);
        expect(warehouse.Inventory['4']).to.be.equal(75);
        expect(warehouse.Inventory['5']).to.be.equal(70);
        expect(warehouse.Inventory['6']).to.be.equal(65);
        expect(warehouse.Inventory['7']).to.be.equal(60);
        expect(warehouse.Inventory['8']).to.be.equal(55);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['3']).to.be.undefined;
        expect(res.AllocationAvailability['4']).to.be.undefined;
        expect(res.AllocationAvailability['5']).to.be.undefined;
        expect(res.AllocationAvailability['6']).to.be.undefined;
        expect(res.AllocationAvailability['7']).to.be.undefined;
        expect(res.AllocationAvailability['8']).to.be.undefined;
      });

      it('Third submit - change- qty - change 2 of the item #1, 4 of the item #2, 6 of the item #3, 8 of the item #4, 10 of the item #5, 12 of the item #6, 14 of the item #7, 16 of the item #8 - all should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 2
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 4
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 6
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 8
          },
          {
            ItemExternalID: '5',
            UnitsQuantity: 10
          },
          {
            ItemExternalID: '6',
            UnitsQuantity: 12
          },
          {
            ItemExternalID: '7',
            UnitsQuantity: 14
          },
          {
            ItemExternalID: '8',
            UnitsQuantity: 16
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log("Res - ", res);
    
        expect(warehouse.Inventory['1']).to.be.equal(98);
        expect(warehouse.Inventory['2']).to.be.equal(96);
        expect(warehouse.Inventory['3']).to.be.equal(94);
        expect(warehouse.Inventory['4']).to.be.equal(92);
        expect(warehouse.Inventory['5']).to.be.equal(90);
        expect(warehouse.Inventory['6']).to.be.equal(88);
        expect(warehouse.Inventory['7']).to.be.equal(86);
        expect(warehouse.Inventory['8']).to.be.equal(84);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['3']).to.be.undefined;
        expect(res.AllocationAvailability['4']).to.be.undefined;
        expect(res.AllocationAvailability['5']).to.be.undefined;
        expect(res.AllocationAvailability['6']).to.be.undefined;
        expect(res.AllocationAvailability['7']).to.be.undefined;
        expect(res.AllocationAvailability['8']).to.be.undefined;
      });
    })

    describe("27 case - cancel - with sufficient qty", async () => {
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

      it('Initial submit - order 5 of the item #1, 10 of the item #2, 15 of the item #3, 20 of the item #4, 25 of the item #5, 30 of the item #6, 35 of the item #7, 40 of the item #8 - all should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 5
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 10
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 15
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '5',
            UnitsQuantity: 25
          },
          {
            ItemExternalID: '6',
            UnitsQuantity: 30
          },
          {
            ItemExternalID: '7',
            UnitsQuantity: 35
          },
          {
            ItemExternalID: '8',
            UnitsQuantity: 40
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(95);
        expect(warehouse.Inventory['2']).to.be.equal(90);
        expect(warehouse.Inventory['3']).to.be.equal(85);
        expect(warehouse.Inventory['4']).to.be.equal(80);
        expect(warehouse.Inventory['5']).to.be.equal(75);
        expect(warehouse.Inventory['6']).to.be.equal(70);
        expect(warehouse.Inventory['7']).to.be.equal(65);
        expect(warehouse.Inventory['8']).to.be.equal(60);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['3']).to.be.undefined;
        expect(res.AllocationAvailability['4']).to.be.undefined;
        expect(res.AllocationAvailability['5']).to.be.undefined;
        expect(res.AllocationAvailability['6']).to.be.undefined;
        expect(res.AllocationAvailability['7']).to.be.undefined;
        expect(res.AllocationAvailability['8']).to.be.undefined;
      });

      it('Second submit - change+ qty - change 10 of the item #1, 15 of the item #2, 20 of the item #3, 25 of the item #4, 30 of the item #5, 35 of the item #6, 40 of the item #7, 45 of the item #8 - all should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 10
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 15
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 20
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 25
          },
          {
            ItemExternalID: '5',
            UnitsQuantity: 30
          },
          {
            ItemExternalID: '6',
            UnitsQuantity: 35
          },
          {
            ItemExternalID: '7',
            UnitsQuantity: 40
          },
          {
            ItemExternalID: '8',
            UnitsQuantity: 45
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log("Res - ", res);
    
        expect(warehouse.Inventory['1']).to.be.equal(90);
        expect(warehouse.Inventory['2']).to.be.equal(85);
        expect(warehouse.Inventory['3']).to.be.equal(80);
        expect(warehouse.Inventory['4']).to.be.equal(75);
        expect(warehouse.Inventory['5']).to.be.equal(70);
        expect(warehouse.Inventory['6']).to.be.equal(65);
        expect(warehouse.Inventory['7']).to.be.equal(60);
        expect(warehouse.Inventory['8']).to.be.equal(55);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['3']).to.be.undefined;
        expect(res.AllocationAvailability['4']).to.be.undefined;
        expect(res.AllocationAvailability['5']).to.be.undefined;
        expect(res.AllocationAvailability['6']).to.be.undefined;
        expect(res.AllocationAvailability['7']).to.be.undefined;
        expect(res.AllocationAvailability['8']).to.be.undefined;
      });

      it('Cancel submit - change qty of all items to 0 in order - return Inventory qty - all should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
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
          },
          {
            ItemExternalID: '5',
            UnitsQuantity: 0
          },
          {
            ItemExternalID: '6',
            UnitsQuantity: 0
          },
          {
            ItemExternalID: '7',
            UnitsQuantity: 0
          },
          {
            ItemExternalID: '8',
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
        expect(warehouse.Inventory['5']).to.be.equal(100);
        expect(warehouse.Inventory['6']).to.be.equal(100);
        expect(warehouse.Inventory['7']).to.be.equal(100);
        expect(warehouse.Inventory['8']).to.be.equal(100);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['3']).to.be.undefined;
        expect(res.AllocationAvailability['4']).to.be.undefined;
        expect(res.AllocationAvailability['5']).to.be.undefined;
        expect(res.AllocationAvailability['6']).to.be.undefined;
        expect(res.AllocationAvailability['7']).to.be.undefined;
        expect(res.AllocationAvailability['8']).to.be.undefined;
      });

    })

    describe("28 case - basic - with insufficient qty", async () => {
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

      it('Initial submit - order 110 of the item #1, 120 of the item #2, 130 of the item #3, 140 of the item #4 - all should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 110
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 120
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 130
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 140
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(0);
        expect(warehouse.Inventory['2']).to.be.equal(0);
        expect(warehouse.Inventory['3']).to.be.equal(0);
        expect(warehouse.Inventory['4']).to.be.equal(0);
        expect(res.Success).to.be.false;
        expect(res.AllocationAvailability['1']).to.be.equal(100);
        expect(res.AllocationAvailability['2']).to.be.equal(100);
        expect(res.AllocationAvailability['3']).to.be.equal(100);
        expect(res.AllocationAvailability['4']).to.be.equal(100);
      });
    })

    describe("29 case - modification qty - with insufficient qty", async () => {
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

      it('Initial submit - order 110 of the item #1, 120 of the item #2, 130 of the item #3, 140 of the item #4 - all should be blocked', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 110
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 120
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 130
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 140
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(0);
        expect(warehouse.Inventory['2']).to.be.equal(0);
        expect(warehouse.Inventory['3']).to.be.equal(0);
        expect(warehouse.Inventory['4']).to.be.equal(0);
        expect(res.Success).to.be.false;
        expect(res.AllocationAvailability['1']).to.be.equal(100);
        expect(res.AllocationAvailability['2']).to.be.equal(100);
        expect(res.AllocationAvailability['3']).to.be.equal(100);
        expect(res.AllocationAvailability['4']).to.be.equal(100);
      });

      it('Second submit - change+ qty - change 120 of the item #1, 130 of the item #2, 140 of the item #3, 150 of the item #4 - all should be blocked', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 120
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 130
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 140
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 150
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log("Res - ", res);
    
        expect(warehouse.Inventory['1']).to.be.equal(0);
        expect(warehouse.Inventory['2']).to.be.equal(0);
        expect(warehouse.Inventory['3']).to.be.equal(0);
        expect(warehouse.Inventory['4']).to.be.equal(0);
        expect(res.Success).to.be.false;
        expect(res.AllocationAvailability['1']).to.be.equal(100);
        expect(res.AllocationAvailability['2']).to.be.equal(100);
        expect(res.AllocationAvailability['3']).to.be.equal(100);
        expect(res.AllocationAvailability['4']).to.be.equal(100);
      });

      it('Third submit - change- qty - change 105 of the item #1, 115 of the item #2, 125 of the item #3, 135 of the item #4 - all should be blocked', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 105
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 115
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 125
          },
          {
            ItemExternalID: '4',
            UnitsQuantity: 135
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log("Res - ", res);
    
        expect(warehouse.Inventory['1']).to.be.equal(0);
        expect(warehouse.Inventory['2']).to.be.equal(0);
        expect(warehouse.Inventory['3']).to.be.equal(0);
        expect(warehouse.Inventory['4']).to.be.equal(0);
        expect(res.Success).to.be.false;
        expect(res.AllocationAvailability['1']).to.be.equal(100);
        expect(res.AllocationAvailability['2']).to.be.equal(100);
        expect(res.AllocationAvailability['3']).to.be.equal(100);
        expect(res.AllocationAvailability['4']).to.be.equal(100);
      });
    })

    describe("30 case - cancel - with insufficient qty", async () => {
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

      it('Initial submit - order 110 of the item #1, 120 of the item #2, 130 of the item #3 - all should be blocked', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
          {
            ItemExternalID: '1',
            UnitsQuantity: 110
          },
          {
            ItemExternalID: '2',
            UnitsQuantity: 120
          },
          {
            ItemExternalID: '3',
            UnitsQuantity: 130
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(0);
        expect(warehouse.Inventory['2']).to.be.equal(0);
        expect(warehouse.Inventory['3']).to.be.equal(0);
        expect(res.Success).to.be.false;
        expect(res.AllocationAvailability['1']).to.be.equal(100);
        expect(res.AllocationAvailability['2']).to.be.equal(100);
        expect(res.AllocationAvailability['3']).to.be.equal(100);
      });

      it('Cancel submit - change qty of all items to 0 in the order - return Inventory qty - all should success', async () => {        
        const res = await apiClient.allocatedOrder(warehouseID, orderID, user, [
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
          }
        ])
    
        let warehouse = await apiClient.getWarehouse(warehouseID);
          
        console.log(warehouse);
        console.log(res);
    
        expect(warehouse.Inventory['1']).to.be.equal(100);
        expect(warehouse.Inventory['2']).to.be.equal(100);
        expect(warehouse.Inventory['3']).to.be.equal(100);
        expect(warehouse.Inventory['4']).to.be.equal(100);
        expect(warehouse.Inventory['5']).to.be.equal(100);
        expect(warehouse.Inventory['6']).to.be.equal(100);
        expect(warehouse.Inventory['7']).to.be.equal(100);
        expect(warehouse.Inventory['8']).to.be.equal(100);
        expect(res.Success).to.be.true;
        expect(res.AllocationAvailability['1']).to.be.undefined;
        expect(res.AllocationAvailability['2']).to.be.undefined;
        expect(res.AllocationAvailability['3']).to.be.undefined;
        expect(res.AllocationAvailability['4']).to.be.undefined;
        expect(res.AllocationAvailability['5']).to.be.undefined;
        expect(res.AllocationAvailability['6']).to.be.undefined;
        expect(res.AllocationAvailability['7']).to.be.undefined;
        expect(res.AllocationAvailability['8']).to.be.undefined;
      });

    })
  }); 
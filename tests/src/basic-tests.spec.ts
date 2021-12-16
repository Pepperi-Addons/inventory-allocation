import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from './helpers';
import { ApiClient } from './api-client';

const apiClient = new ApiClient();

describe('Basic tests', function () {

  // before(() => apiClient.install());

  // after(() => apiClient.uninstall());

  // describe('Warehouse rebase', () => {
  //   it('Rebase Inventories should match', async () => {
  //     const warehouseID = uuid();
  
  //     await apiClient.rebase(warehouseID, {
  //       '1': 30,
  //       '2': 50
  //     });
  
  //     let warehouse = await apiClient.getWarehouse(warehouseID);
  
  //     expect(warehouse.Inventory['1']).to.be.equal(30);
  //     expect(warehouse.Inventory['2']).to.be.equal(50);
  //   })

  //   it('Scheduled job runs', async () => {
  //     const warehouseID = uuid();
  
  //     await apiClient.rebase(warehouseID, {
  //       '1': 30,
  //       '2': 50
  //     });
  
  //     await apiClient.createUserAllocation(warehouseID, uuid(), '1', 25, yesterday(), tomorrow());
  
  //     await sleepTilTheFiveMinuteMarker();
  
  //     let warehouse = await apiClient.getWarehouse(warehouseID);
  
  //     expect(warehouse.Inventory['1']).to.be.equal(5);
  //     expect(warehouse.Inventory['2']).to.be.equal(50);
  //     expect(warehouse.UserAllocations['1']).to.be.equal(25);
  //   })
  // })

  // describe('Inventory Allocation', () => {

  //   it('Allocation should succeed', async () => {
  //     const warehouseID = uuid();
  
  //     await apiClient.rebase(warehouseID, {
  //       '1': 30,
  //       '2': 50
  //     });
  
  //     const res = await apiClient.allocatedOrder(warehouseID, uuid(), uuid(), [
  //       {
  //         ItemExternalID: '1',
  //         UnitsQuantity: 20
  //       },
  //       {
  //         ItemExternalID: '2',
  //         UnitsQuantity: 20
  //       }
  //     ])
  
  //     expect(res.Success).to.be.true;
  //   })

  //   it('Allocation should fail', async () => {
  //     const warehouseID = uuid();
  
  //     await apiClient.rebase(warehouseID, {
  //       '1': 15,
  //       '2': 20
  //     });
  
  //     const res = await apiClient.allocatedOrder(warehouseID, uuid(), uuid(), [
  //       {
  //         ItemExternalID: '1',
  //         UnitsQuantity: 20
  //       },
  //       {
  //         ItemExternalID: '2',
  //         UnitsQuantity: 20
  //       }
  //     ])
  
  //     expect(res.Success).to.be.false;
  //     expect(res.AllocationAvailability['1']).to.be.equal(15);
  //     expect(res.AllocationAvailability['2']).to.be.undefined;
  //   })

  //   it('Warehouse should have less inventory', async () => {
  //     const warehouseID = uuid();
  
  //     await apiClient.rebase(warehouseID, {
  //       '1': 30,
  //       '2': 50
  //     });
  
  //     const res = await apiClient.allocatedOrder(warehouseID, uuid(), uuid(), [
  //       {
  //         ItemExternalID: '1',
  //         UnitsQuantity: 20
  //       },
  //       {
  //         ItemExternalID: '2',
  //         UnitsQuantity: 20
  //       }
  //     ])
  
  //     expect(res.Success).to.be.true;
  
  //     let warehouse = await apiClient.getWarehouse(warehouseID);
  
  //     expect(warehouse.Inventory['1']).to.be.equal(10);
  //     expect(warehouse.Inventory['2']).to.be.equal(30);
  //   })
  // })

  // describe('User Allocation', () => {
  //   it('User Allocation removes from inventory', async () => {
  //     const warehouseID = uuid();
  
  //     await apiClient.rebase(warehouseID, {
  //       '1': 30,
  //       '2': 50
  //     });
  
  //     await apiClient.createUserAllocation(warehouseID, uuid(), '1', 25, yesterday(), tomorrow());
  
  //     await apiClient.forceResetAllocations();
  
  //     let warehouse = await apiClient.getWarehouse(warehouseID);
  
  //     expect(warehouse.Inventory['1']).to.be.equal(5);
  //     expect(warehouse.Inventory['2']).to.be.equal(50);
  //     expect(warehouse.UserAllocations['1']).to.be.equal(25);
  //   })
  
  //   it('User Allocation goes back in inventory', async () => {
  //     const warehouseID = uuid();
  //     const userUUID = uuid();
  
  //     await apiClient.rebase(warehouseID, {
  //       '1': 30,
  //       '2': 50
  //     });
  
  //     await apiClient.createUserAllocation(warehouseID, userUUID, '1', 25, yesterday(), tomorrow());
  
  //     await apiClient.forceResetAllocations();
  
  //     let warehouse = await apiClient.getWarehouse(warehouseID);
  
  //     expect(warehouse.Inventory['1']).to.be.equal(5);
  //     expect(warehouse.Inventory['2']).to.be.equal(50);
  //     expect(warehouse.UserAllocations['1']).to.be.equal(25);
  
  //     // update the allocation
  //     await apiClient.createUserAllocation(warehouseID, userUUID, '1', 25, yesterday(), yesterday());
  
  //     await apiClient.forceResetAllocations();
  
  //     warehouse = await apiClient.getWarehouse(warehouseID);
  
  //     expect(warehouse.Inventory['1']).to.be.equal(30);
  //     expect(warehouse.Inventory['2']).to.be.equal(50);
  //     expect(warehouse.UserAllocations['1']).to.be.undefined;
  //   })
  // })

  describe('Senario #1 - Temp allocation', () => {

    const warehouseID = uuid();
    let allocTime = new Date();

    it('Allocation should fail', async () => {

      await apiClient.rebase(warehouseID, {
        '1': 15,
        '2': 20
      });

      const res = await apiClient.allocatedOrder(warehouseID, uuid(), uuid(), [
        {
          ItemExternalID: '1',
          UnitsQuantity: 20
        },
        {
          ItemExternalID: '2',
          UnitsQuantity: 20
        }
      ])
      allocTime = new Date();

    console.log(res);

      expect(res.Success).to.be.false;
      expect(res.AllocationAvailability['1']).to.be.equal(15);
      expect(res.AllocationAvailability['2']).to.be.undefined;
    })

    it('See that the inventory was subtracted', async () => {
      const warehouse = await apiClient.getWarehouse(warehouseID);

      console.log(warehouse);

      expect(warehouse.Inventory['1']).to.be.undefined;
      expect(warehouse.Inventory['2']).to.be.undefined;
    })

    it('Wait one minute', () => sleep(60 * 1000))

    it('force the reset allocation', () => apiClient.forceResetAllocations())

    it('See that the inventory was put back in the warehouse', async () => {
      const warehouse = await apiClient.getWarehouse(warehouseID);

      expect(warehouse.Inventory['1']).to.be.equal(15);
      expect(warehouse.Inventory['2']).to.be.equal(20);
    })
  })

  describe('Senario #2 - 2 overlapping user allocations', () => {
    const warehouseID = uuid();
    const user1 = uuid();
    const user2 = uuid();
    const user3 = uuid();
    const order1 = uuid();

    it('Rebase warehouse', async () => {
      await apiClient.rebase(warehouseID, {
        '1': 15,
        '2': 20
      });

      const warehouse = await apiClient.getWarehouse(warehouseID);

      expect(warehouse.Inventory).to.be.deep.equals({
        '1': 15,
        '2': 20
      });
      expect(warehouse.UserAllocations).to.be.empty;
    })

    it('Allocate users', async () => {
      await apiClient.createUserAllocation(warehouseID, user1, '2', 15, yesterday(), tomorrow());
      await apiClient.createUserAllocation(warehouseID, user2, '2', 15, yesterday(), tomorrow());

      const warehouse = await apiClient.getWarehouse(warehouseID);
      expect(warehouse.Inventory).to.be.deep.equals({
        '1': 15,
        '2': 20
      });
      expect(warehouse.UserAllocations).to.be.empty;
    })

    it('Force reset allocaitons', () => apiClient.forceResetAllocations());

    it('Check the the warehouse', async () => {
      const warehouse = await apiClient.getWarehouse(warehouseID);
      console.log(warehouse);

      expect(warehouse.Inventory).to.be.deep.equals({
        '1': 15,
      });
      expect(warehouse.UserAllocations['2']).to.be.equal(20);
    })

    it('Third user gets none', async () => {
      const obj = await apiClient.allocatedOrder(warehouseID, uuid(), user3, [
        {
          ItemExternalID: '2',
          UnitsQuantity: 15
        }
      ]);

      const warehouse = await apiClient.getWarehouse(warehouseID);
      console.log(warehouse);

      console.log(obj);

      expect(obj.Success).to.be.false;
      expect(obj.AllocationAvailability['2']).to.be.equal(0);
    })

    it('Second User uses more than his share', async () => {
      const obj = await apiClient.allocatedOrder(warehouseID, uuid(), user2, [
        {
          ItemExternalID: '2',
          UnitsQuantity: 17
        }
      ]);

      expect(obj.Success).to.be.false;
      expect(obj.AllocationAvailability['2']).to.be.equal(15);
    })

    it('Wait for temp to expire', () => sleep(60*1000));

    it('Force Reset', () => apiClient.forceResetAllocations());

    it('Second User uses his share', async () => {
      const obj = await apiClient.allocatedOrder(warehouseID, order1, user2, [
        {
          ItemExternalID: '2',
          UnitsQuantity: 15
        }
      ]);

      expect(obj.Success).to.be.true;
    });

    it('Check the the warehouse', async () => {
      const warehouse = await apiClient.getWarehouse(warehouseID);
      console.log(warehouse);

      expect(warehouse.Inventory).to.be.deep.equals({
        '1': 15,
      });
      expect(warehouse.UserAllocations['2']).to.be.equal(5);
    })

    it('First User tries but already lost part of his share', async () => {
      const obj = await apiClient.allocatedOrder(warehouseID, uuid(), user1, [
        {
          ItemExternalID: '2',
          UnitsQuantity: 15
        }
      ]);

      expect(obj.Success).to.be.false;
      expect(obj.AllocationAvailability['2']).to.be.equal(5);
    });

    it('Second User gives back some of his share', async () => {
      const obj = await apiClient.allocatedOrder(warehouseID, order1, user2, [
        {
          ItemExternalID: '2',
          UnitsQuantity: 5
        }
      ]);

      expect(obj.Success).to.be.true;
    });

    it('Wait a minute', () => sleep(60*1000));

    it('Force reset allocaitons', () => apiClient.forceResetAllocations());

    it('Third user gets still gets none', async () => {
      const obj = await apiClient.allocatedOrder(warehouseID, uuid(), user3, [
        {
          ItemExternalID: '2',
          UnitsQuantity: 15
        }
      ]);

      console.log(obj);

      expect(obj.Success).to.be.false;
      expect(obj.AllocationAvailability['2']).to.be.equal(0);
    })

    it('First User can now use his share', async () => {
      const obj = await apiClient.allocatedOrder(warehouseID, uuid(), user1, [
        {
          ItemExternalID: '2',
          UnitsQuantity: 15
        }
      ]);

      expect(obj.Success).to.be.true;
    });
  })

  describe('Senario #3 - rebase with existing allocations', () => {
    const warehouseID = uuid();
    const user1 = uuid();
    const user2 = uuid();
    const user3 = uuid();
    const order1 = uuid();
    const order2 = uuid();
    const order3 = uuid();

    it('Rebase warehouse', async () => {
      await apiClient.rebase(warehouseID, {
        '1': 100,
        '2': 100,
        '3': 150,
        '4': 150
      });

      const warehouse = await apiClient.getWarehouse(warehouseID);

      expect(warehouse.Inventory).to.be.deep.equals({
        '1': 100,
        '2': 100,
        '3': 150,
        '4': 150
      });
      expect(warehouse.UserAllocations).to.be.empty;
    })

    it('Allocate Users', async () => {
      await apiClient.createUserAllocation(warehouseID, user1, '1', 25, yesterday(), tomorrow());
      await apiClient.createUserAllocation(warehouseID, user2, '3', 50, yesterday(), tomorrow());
    })

    it('Force reset', async () => apiClient.forceResetAllocations());

    it('Check warehouse', async () => {
      const warehouse = await apiClient.getWarehouse(warehouseID);

      expect(warehouse.Inventory).to.be.deep.equals({
        '1': 75,
        '2': 100,
        '3': 100,
        '4': 150
      });
      expect(warehouse.UserAllocations).to.deep.equals({
        '1': 25,
        '3': 50,
      });
    })

    it('Allocate orders', async () => {
      await apiClient.allocatedOrder(warehouseID, order1, user3, [
        {
          ItemExternalID: '1',
          UnitsQuantity: 25
        },
        {
          ItemExternalID: '4',
          UnitsQuantity: 25
        },
      ]);
      await apiClient.allocatedOrder(warehouseID, order2, user1, [
        {
          ItemExternalID: '1',
          UnitsQuantity: 25
        },
        {
          ItemExternalID: '4',
          UnitsQuantity: 25
        },
      ]);
      await apiClient.allocatedOrder(warehouseID, order3, user2, [
        {
          ItemExternalID: '3',
          UnitsQuantity: 25
        },
        {
          ItemExternalID: '4',
          UnitsQuantity: 25
        },
      ]);
    });

    it('Check warehouse', async () => {
      const warehouse = await apiClient.getWarehouse(warehouseID);

      expect(warehouse.Inventory).to.be.deep.equals({
        '1': 50,
        '2': 100,
        '3': 100,
        '4': 75
      });
      expect(warehouse.UserAllocations).to.deep.equals({
        '3': 25,
      });
    })

    it('Rebase warehouse', async () => {
      await apiClient.rebase(warehouseID, {
        '1': 50,
        '2': 75,
        '3': 200,
        '4': 150
      });

      const warehouse = await apiClient.getWarehouse(warehouseID);

      expect(warehouse.Inventory).to.be.deep.equals({
        '2': 75,
        '3': 150,
        '4': 75
      });
      expect(warehouse.UserAllocations).to.deep.equals({
        '3': 25,
      });
    })

    it('Commit Orders', async () => {
      await apiClient.commitAllocations(warehouseID, [order1, order2, order3]);
    })

    it('Check warehouse - no changes', async () => {
      const warehouse = await apiClient.getWarehouse(warehouseID);

      expect(warehouse.Inventory).to.be.deep.equals({
        '2': 75,
        '3': 150,
        '4': 75
      });
      expect(warehouse.UserAllocations).to.deep.equals({
        '3': 25,
      });
    })

    it('rebase again', async () => {
      await apiClient.rebase(warehouseID, {
        '1': 100,
        '2': 75,
        '3': 200,
        '4': 150
      });
    })

    it('Check warehouse', async () => {
      const warehouse = await apiClient.getWarehouse(warehouseID);

      expect(warehouse.Inventory).to.be.deep.equals({
        '1': 100,
        '2': 75,
        '3': 175,
        '4': 150
      });
      expect(warehouse.UserAllocations).to.deep.equals({
        '3': 25,
      });
    })
  })
})
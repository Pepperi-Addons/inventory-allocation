import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from './helpers';
import { ApiClient } from './api-client';

const apiClient = new ApiClient();

describe('Basic tests', function () {

  before(() => apiClient.install());

  after(() => apiClient.uninstall());

  it('Rebase Inventories should match', async () => {
    const warehouseID = uuid();

    await apiClient.rebase(warehouseID, {
      '1': 30,
      '2': 50
    });

    let warehouse = await apiClient.getWarehouse(warehouseID);

    expect(warehouse.Inventory['1']).to.be.equal(30);
    expect(warehouse.Inventory['2']).to.be.equal(50);
  })

  it('Allocation should succeed', async () => {
    const warehouseID = uuid();

    await apiClient.rebase(warehouseID, {
      '1': 30,
      '2': 50
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

    expect(res.Success).to.be.true;
  })

  it('Warehouse should have less inventory', async () => {
    const warehouseID = uuid();

    await apiClient.rebase(warehouseID, {
      '1': 30,
      '2': 50
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

    expect(res.Success).to.be.true;

    let warehouse = await apiClient.getWarehouse(warehouseID);

    expect(warehouse.Inventory['1']).to.be.equal(10);
    expect(warehouse.Inventory['2']).to.be.equal(30);
  })

  it('User Allocation removes from warehouse', async () => {
    const warehouseID = uuid();

    await apiClient.rebase(warehouseID, {
      '1': 30,
      '2': 50
    });

    await apiClient.createUserAllocation(warehouseID, uuid(), '1', 25, yesterday(), tomorrow());

    await sleepTilTheFiveMinuteMarker();

    let warehouse = await apiClient.getWarehouse(warehouseID);

    expect(warehouse.Inventory['1']).to.be.equal(5);
    expect(warehouse.Inventory['2']).to.be.equal(50);
    expect(warehouse.UserAllocations['1']).to.be.equal(25);
  })

  describe('Temp Allocation', () => {

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

      expect(res.Success).to.be.false;
      expect(res.AllocationAvailability['1']).to.be.equal(15);
      expect(res.AllocationAvailability['2']).to.be.undefined;
    })

    it('See that the inventory was subtracted', async () => {
      const warehouse = await apiClient.getWarehouse(warehouseID);

      expect(warehouse.Inventory['1']).to.be.equal(0);
      expect(warehouse.Inventory['2']).to.be.equal(0);
    })

    it('Wait one minute', () => sleep(60 * 1000))

    it('Wait till the five minute marker', () => sleepTilTheFiveMinuteMarker(allocTime));

    it('See that the inventory was put back in the warehouse', async () => {
      const warehouse = await apiClient.getWarehouse(warehouseID);

      expect(warehouse.Inventory['1']).to.be.equal(15);
      expect(warehouse.Inventory['2']).to.be.equal(20);
    })
  })
})
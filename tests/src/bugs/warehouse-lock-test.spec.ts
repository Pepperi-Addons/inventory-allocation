import 'mocha'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai';
import { sleep, sleepTilTheFiveMinuteMarker, tomorrow, yesterday } from '../helpers';
import { ApiClient } from '../api-client';

const apiClient = new ApiClient();

describe("Warehouse lock", () => {
    before(() => apiClient.install());

    after(() => apiClient.uninstall());

    describe("Lock case - Make a lot api call of one warehouse - must not return an error", async () => {
        const warehouseID = uuid();
        const user = uuid();
        const order = uuid();
        const apiCalls = 200;
        var successCalls = 0;
        var failedCalls = 0;
    
        it('Rebase warehouse + Allocated Order - 200 calls - First part', async () => {
          for (var i = 0; i < apiCalls; i++) {
            try {
              await apiClient.rebase(warehouseID, {
                '1': 30,
                '2': 50
              });
              successCalls++;
              console.log("SuccessCalls = ", successCalls);
            } catch (error) {
              failedCalls++;
              console.log(error);
            }
          } 

          console.log("After all calls, successCalls = ", successCalls);

          expect(successCalls).to.be.equal(200);
        });

        it('Rebase warehouse + Allocated Order - 200 calls - Second part', async () => {
          for (var i = 0; i < apiCalls; i++) {
            try {
              await apiClient.rebase(warehouseID, {
                '1': 30,
                '2': 50
              });
              successCalls++;
              console.log("SuccessCalls = ", successCalls);
            } catch (error) {
              failedCalls++;
              console.log(error);
            }
          } 
  
          console.log("After all calls, successCalls = ", successCalls);
  
          expect(successCalls).to.be.equal(400);
        });

        it('Rebase warehouse + Allocated Order - 600 calls - Third part', async () => {
          for (var i = 0; i < apiCalls; i++) {
            try {
              await apiClient.rebase(warehouseID, {
                '1': 30,
                '2': 50
              });
              successCalls++;
              console.log("SuccessCalls = ", successCalls);
            } catch (error) {
              failedCalls++;
              console.log(error);
            }
          } 
  
          console.log("After all calls, successCalls = ", successCalls);
  
          expect(successCalls).to.be.equal(600);
        });
    })
});

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { AddonService } from '../addon/addon.service';
import { GenericListDataSource } from '../generic-list/generic-list.component';

@Component({
  selector: 'addon-order-allocation',
  templateUrl: './order-allocation.component.html',
  styleUrls: ['./order-allocation.component.scss']
})
export class OrderAllocationComponent implements OnInit {

  orderUUID: string;
  orderAllocation: any;

  constructor(
    private addonService: PepAddonService,
    private pluginService: AddonService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.pluginService.pluginUUID = this.route.snapshot.params['addon_uuid'];
    this.orderUUID = this.route.snapshot.params['order_uuid'];
  }

  back() {
    this.router.navigate(['..', '..', 'inventory_allocations'], {
      queryParamsHandling: 'merge',
      relativeTo: this.route
    })
  }

  async getOrderAllocation() {
    if (!this.orderAllocation) {
      this.orderAllocation = await this.addonService.getAddonApiCall(
        this.pluginService.pluginUUID, 
        'inventory_allocation', 
        `order_allocations?where=OrderUUID='${this.orderUUID}'`
        ).toPromise().then(obj => obj[0]);
    }
    return this.orderAllocation;
  }

  dataSource: GenericListDataSource = {
    getList: (state) => {
      return this.getOrderAllocation().then(orderAllocation => {
          const res = [];

          let keys = [...new Set([ 
            ...Object.keys(orderAllocation.ItemAllocations),
            ...Object.keys(orderAllocation.TempItemAllocations || {})
          ])];
          
          if (state.searchString) {
            keys = keys.filter(key => key.toLowerCase().includes(state.searchString.toLowerCase()))
          }

          for (const item of keys) {
            res.push({
              Item: item,
              Allocated: orderAllocation.ItemAllocations[item].toString(),
              TempAllocated: ((orderAllocation.TempItemAllocations|| {})[item] || 0).toString()
            })
          }

          return res;
        });
    },
    getActions: async () => {
        return []
    },
    getDataView: async () => {
      return {
          Context: {
            Name: '',
            Profile: { InternalID: 0 },
            ScreenSize: 'Landscape'
          },
          Type: 'Grid',
          Title: '',
          Fields: [
            {
              FieldID: 'Item',
              Type: 'TextBox',
              Title: 'Item',
              Mandatory: false,
              ReadOnly: true
            },
            {
              FieldID: 'Allocated',
              Type: 'TextBox',
              Title: 'Allocation',
              Mandatory: false,
              ReadOnly: true
            },
            {
              FieldID: 'TempAllocated',
              Type: 'TextBox',
              Title: 'Temporary Allocation',
              Mandatory: false,
              ReadOnly: true
            }
          ],
          Columns: [
            {
              Width: 25
            },
            {
              Width: 25
            },
            {
              Width: 25
            }
          ],
          FrozenColumnsCount: 0,
          MinimumColumnWidth: 0
        }
    }
  }

}

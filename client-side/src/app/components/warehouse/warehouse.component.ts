import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { AddonService } from '../addon/addon.service';
import { GenericListDataSource } from '../generic-list/generic-list.component';

@Component({
  selector: 'addon-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {

  warehouseID: string = ''
  warehouse;

  constructor(
    private addonService: PepAddonService,
    private pluginService: AddonService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.pluginService.pluginUUID = this.route.snapshot.params['addon_uuid'];
    this.warehouseID = this.route.snapshot.params['warehouse_id'];
  }

  back() {
    this.router.navigate(['..', '..', 'inventory_allocations'], {
      queryParamsHandling: 'merge',
      relativeTo: this.route
    })
  }

  async getWarehouse() {
    if (!this.warehouse) {
      this.warehouse = await this.addonService.getAddonApiCall(
        this.pluginService.pluginUUID, 
        'inventory_allocation', 
        `warehouses?where=WarehouseID='${this.warehouseID}'`
        ).toPromise().then(obj => obj[0]);
    }
    return this.warehouse;
  }

  dataSource: GenericListDataSource = {
    getList: (state) => {
      return this.getWarehouse().then(warehouse => {
          const res = [];

          let keys = [
            ...new Set([
              ...Object.keys(warehouse.Inventory), 
              ...Object.keys(warehouse.UserAllocations)
            ])
        ];
          
          if (state.searchString) {
            keys = keys.filter(key => key.toLowerCase().includes(state.searchString.toLowerCase()))
          }

          for (const item of keys) {
            res.push({
              Item: item,
              Quantity: (warehouse.Inventory[item] || 0).toString(),
              UserAllocations: (warehouse.UserAllocations[item] || 0).toString()
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
              FieldID: 'Quantity',
              Type: 'TextBox',
              Title: 'Quantity',
              Mandatory: false,
              ReadOnly: true
            },
            {
              FieldID: 'UserAllocations',
              Type: 'TextBox',
              Title: 'Allocated to Users',
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
            }
          ],
          FrozenColumnsCount: 0,
          MinimumColumnWidth: 0
        }
    }
  }
}

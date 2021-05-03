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

  dataSource: GenericListDataSource = {
    getList: () => {
      return this.addonService.getAddonApiCall(
        this.pluginService.pluginUUID, 
        'inventory_allocation', 
        `warehouses?where=WarehouseID='${this.warehouseID}'`
        ).toPromise().then(arr => {
          const res = [];

          for (const item in arr[0].Inventory) {
            res.push({
              Item: item,
              Quantity: arr[0].Inventory[item].toString()
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

import {
    Component,
    OnInit,
    Compiler,
    ViewChild,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PepAddonService, PepLayoutService, PepScreenSizeType } from '@pepperi-addons/ngx-lib';
import { AddonService } from './addon.service';
import { GenericListComponent, GenericListDataSource } from "../generic-list/generic-list.component";
import { UserAllocationDialogComponent } from "../user-allocation-dialog/user-allocation-dialog.component";


@Component({
  selector: 'addon-addon',
  templateUrl: './addon.component.html',
  styleUrls: ['./addon.component.scss'],
  providers: [AddonService]
})
export class AddonComponent implements OnInit {
    @ViewChild(GenericListComponent) 
    userAllocationList: GenericListComponent;

    screenSize: PepScreenSizeType;

    searchFields = ['UserID', 'ItemExternalID', 'WarehouseID'];

    constructor(
        public pluginService: AddonService,
        private translate: TranslateService,
        public routeParams: ActivatedRoute,
        public router: Router,
        public compiler: Compiler,
        public layoutService: PepLayoutService,
        private addonService: PepAddonService
    ) {

        // Parameters sent from url
        this.pluginService.pluginUUID = this.routeParams.snapshot.params['addon_uuid'];
        let userLang = "en";
        translate.setDefaultLang(userLang);
        userLang = translate.getBrowserLang().split("-")[0]; // use navigator lang if available
        translate.use(userLang);
        this.layoutService.onResize$.subscribe(size => {
            this.screenSize = size;
        });

    }

  ngOnInit(): void {
  }

  warehouseDatasource: GenericListDataSource = {
      getList: () => {
        return this.addonService.getAddonApiCall(this.pluginService.pluginUUID, 'inventory_allocation', 'warehouses').toPromise();
      },
      getActions: async (obj) => {
          if (obj) {
            return [
                {
                    'title': "Show",
                    'handler': async (obj) => {
                        this.router.navigate(['..', 'warehouse', obj.WarehouseID], {
                            queryParamsHandling: 'merge',
                            relativeTo: this.routeParams
                        })
                    }
                }
            ]
          }
          return [];
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
                FieldID: 'WarehouseID',
                Type: 'TextBox',
                Title: 'ID',
                Mandatory: false,
                ReadOnly: true
              },
              {
                FieldID: 'CreationDateTime',
                Type: 'DateAndTime',
                Title: 'Created',
                Mandatory: false,
                ReadOnly: true
              },
              {
                FieldID: 'ModificationDateTime',
                Type: 'DateAndTime',
                Title: 'Modified',
                Mandatory: false,
                ReadOnly: true
              },
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
              },
            ],
            FrozenColumnsCount: 0,
            MinimumColumnWidth: 0
          }
      }
  }

  orderAllocationsDatasource: GenericListDataSource = {
    getList: () => {
      return this.addonService.getAddonApiCall(this.pluginService.pluginUUID, 'inventory_allocation', 'order_allocations').toPromise();
    },
    getActions: async (obj) => {
        if (obj) {
          return [
              {
                  'title': "Show",
                  'handler': async (obj) => {
                      this.router.navigate(['..', 'order_allocation', obj.OrderUUID], {
                          queryParamsHandling: 'merge',
                          relativeTo: this.routeParams
                      })
                  }
              }
          ]
        }
        return [];
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
                FieldID: 'OrderUUID',
                Type: 'TextBox',
                Title: 'UUID',
                Mandatory: false,
                ReadOnly: true
              },
            {
                FieldID: 'UserID',
                Type: 'TextBox',
                Title: 'User',
                Mandatory: false,
                ReadOnly: true
              },
            {
              FieldID: 'WarehouseID',
              Type: 'TextBox',
              Title: 'Warehouse',
              Mandatory: false,
              ReadOnly: true
            },
            {
              FieldID: 'CreationDateTime',
              Type: 'Date',
              Title: 'Created',
              Mandatory: false,
              ReadOnly: true
            },
            {
              FieldID: 'ModificationDateTime',
              Type: 'Date',
              Title: 'Modified',
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
            },
            {
              Width: 25
            },
            {
              Width: 25
            },
          ],
          FrozenColumnsCount: 0,
          MinimumColumnWidth: 0
        }
    }
}

  userDatasource: GenericListDataSource = {
    getList: (state) => {
      return this.addonService.getAddonApiCall(
          this.pluginService.pluginUUID, 
          'inventory_allocation', 
          'user_allocations')
          .toPromise()
          .then(res => res.map(obj => {
              obj.MaxAllocation = obj.MaxAllocation.toString();
              obj.UsedAllocation = obj.UsedAllocation.toString();
              return obj;
          }))
          .then(res => res.filter(
            obj => {
              let res = true;
              if (state.searchString) {
                res = this.searchFields.find(field => obj[field].toLowerCase().includes(state.searchString.toLowerCase())) != undefined;
              }
              return res;
            }
          ));
    },
    getActions: async (obj) => {
      const res = [];  
      if (obj) {
        res.push({
          title: this.translate.instant('Edit'),
          handler: async (obj) => {
              this.showUserAllocationDialog(obj);
          }
        });

        if (!obj.Allocated) {
          res.push({
            title: this.translate.instant('Delete'),
            handler: async (obj) => {
              this.addonService.postAddonApiCall(
                this.pluginService.pluginUUID, 
                'inventory_allocation', 
                'user_allocations', {
                  WarehouseID: obj.WarehouseID,
                  ItemExternalID: obj.ItemExternalID,
                  UserID: obj.UserID,
                  Hidden: true
                })
                .toPromise()
                .then(() => this.userAllocationList.reload())
            }
          });
        }
      }
      return res
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
              FieldID: 'UserID',
              Type: 'TextBox',
              Title: 'User',
              Mandatory: false,
              ReadOnly: true
            },
            {
              FieldID: 'WarehouseID',
              Type: 'TextBox',
              Title: 'Warehouse',
              Mandatory: false,
              ReadOnly: true
            },
            {
                FieldID: 'ItemExternalID',
                Type: 'TextBox',
                Title: 'Item',
                Mandatory: false,
                ReadOnly: true
            },
            {
                FieldID: 'StartDateTime',
                Type: 'Date',
                Title: 'Starts',
                Mandatory: false,
                ReadOnly: true
            },
            {
                FieldID: 'EndDateTime',
                Type: 'Date',
                Title: 'Ends',
                Mandatory: false,
                ReadOnly: true
            },
            {
                FieldID: 'Allocated',
                Type: 'Boolean',
                Title: 'Allocated',
                Mandatory: false,
                ReadOnly: true
            },
            {
                FieldID: 'MaxAllocation',
                Type: 'TextBox',
                Title: 'Max',
                Mandatory: false,
                ReadOnly: true
            },
            {
                FieldID: 'UsedAllocation',
                Type: 'TextBox',
                Title: 'Used',
                Mandatory: false,
                ReadOnly: true
            },
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
            },
            {
                Width: 25
            },
            {
                Width: 25
            },
            {
                Width: 25
            },
            {
                Width: 25
            },
            {
                Width: 25
            },
          ],
          FrozenColumnsCount: 0,
          MinimumColumnWidth: 0
        }
    }
  }

  add() {
    this.showUserAllocationDialog(undefined)
  }

  reallocate() {
    this.addonService.postAddonApiCall(
      this.pluginService.pluginUUID, 
      'inventory_allocation', 
      'reset_allocations')
      .toPromise()
      .then(() => this.userAllocationList.reload())
  }

  showUserAllocationDialog(userAllocation: any) {
    this.pluginService.openDialog(this.translate.instant('Add a User Allocation'), UserAllocationDialogComponent, null, {
      userAllocation: userAllocation
    }, (userAllocation) => {
      if (userAllocation) {
        this.addonService.postAddonApiCall(
          this.pluginService.pluginUUID,
          'inventory_allocation',
          'user_allocations', 
          userAllocation).toPromise().then(() => this.userAllocationList.reload())
      }
    })
  }
}

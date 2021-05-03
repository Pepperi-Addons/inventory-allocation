import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Optional,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  PepHttpService,
  PepDataConvertorService,
  PepLayoutService,
  PepRowData,
  PepFieldData,
  FIELD_TYPE,
  PepScreenSizeType,
  PepGuid,
} from '@pepperi-addons/ngx-lib';
import { IPepFormFieldClickEvent } from '@pepperi-addons/ngx-lib/form';
import {
  IPepListChooserOptionChangeEvent,
  IPepListSortingOptionChangeEvent,
  PepListComponent,
  IPepListSortingOption,
  IPepListView,
  IListViewChangeEvent,
} from '@pepperi-addons/ngx-lib/list';
import {
  PepMenuItem,
  IPepMenuItemClickEvent,
} from '@pepperi-addons/ngx-lib/menu';
import {
  PepFooterStateType,
  IPepFooterStateChangeEvent,
} from '@pepperi-addons/ngx-lib/top-bar';

import { DataView, GridDataViewField, DataViewFieldType, DataViewFieldTypes } from '@pepperi-addons/papi-sdk/dist/entities/data-view';

export interface GenericListDataSource {
    getList(): Promise<any[]>;
    getDataView(): Promise<DataView>;
    getActions(obj: any): Promise<{
        title: string;
        handler: (obj: any) => Promise<void>;
    }[]>;
}

@Component({
  templateUrl: './generic-list.component.html',
  styleUrls: ['./generic-list.component.scss'],
  selector: 'generic-list'
})
export class GenericListComponent implements OnInit, AfterViewInit {
  @ViewChild(PepListComponent) customList: PepListComponent;
  
  @Input()
  dataSource: GenericListDataSource;
  dataObjects: any[] = []

  @Input()
  title: string = ''

  menuHandlers: { [key: string]: (obj: any) => Promise<void> }
  menuActions: Array<PepMenuItem>;
  PepScreenSizeType = PepScreenSizeType;
  screenSize: PepScreenSizeType;

  constructor(
      private dataConvertorService: PepDataConvertorService,
      private layoutService: PepLayoutService,
      // private httpService: PepHttpService,
      private translate: TranslateService
  ) {
      this.layoutService.onResize$.pipe().subscribe((size) => {
          this.screenSize = size;
      });
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
      this.loadlist();
  }

  private loadMenuItems(): void {
      this.getMenuActions().then(x => this.menuActions = x);
  }

  async getMenuActions(): Promise<PepMenuItem[]> {
    const uuid = this.customList.getSelectedItemsData().rows[0];
    const actions = await this.dataSource.getActions(this.getObject(uuid));
    const res: PepMenuItem[] = []
    this.menuHandlers = {};

    actions.forEach(item => {
      const uuid = PepGuid.newGuid();
      this.menuHandlers[uuid] = item.handler;
      res.push({
        key: uuid,
        text: item.title
      })
    })

    return res;
  }

  getObject(uuid: string) {
    return this.dataObjects.find(obj => obj.UID === uuid);
  }

  onMenuItemClicked(action: IPepMenuItemClickEvent): void {
    const uuid = this.customList.getSelectedItemsData().rows[0];
    this.menuHandlers[action.source.key](this.getObject(uuid));
  }

  async loadlist() {
      if (this.customList && this.dataSource) {
          this.dataObjects = await this.dataSource.getList();
          const dataView = await this.dataSource.getDataView();
          const tableData = this.dataObjects.map(x => this.convertToPepRowData(x, dataView));
          const data = this.dataConvertorService.convertListData(tableData);
          data.Rows[0]
          data.Rows.forEach((obj, i) => {
            this.dataObjects[i].UID = obj.UID;
          })
          this.customList.initListData(data.UIControl, data.Rows.length, data.Rows.map(obj => {
            return {
              Success: true, 
              ErrorMessage: '',
              Data: obj,
              Type: "",
              UIControl: data.UIControl,
              IsEditable: false
            }
          }), 'table')
          this.loadMenuItems();
      }
  }

  convertToPepRowData(object: any, dataView: DataView) {
      const row = new PepRowData();
      row.Fields = [];

      for (const field of dataView.Fields as GridDataViewField[]) {
          row.Fields.push({
            ApiName: field.FieldID,
            Title: this.translate.instant(field.Title),
            XAlignment: 1,
            FormattedValue: object[field.FieldID] || '',
            Value: object[field.FieldID] || '',
            ColumnWidth: 10,
            AdditionalValue: '',
            OptionalValues: [],
            FieldType: DataViewFieldTypes[field.Type],
            ReadOnly: field.ReadOnly,
            Enabled: !field.ReadOnly
        })
      }
      return row;
  }

  onAnimationStateChange(state): void { }

  onCustomizeFieldClick(fieldClickEvent: IPepFormFieldClickEvent) { }

  selectedRowsChanged(selectedRowsCount: number) {
    this.loadMenuItems();
  }

  @Output()
  onAddClicked = new EventEmitter<void>();

}

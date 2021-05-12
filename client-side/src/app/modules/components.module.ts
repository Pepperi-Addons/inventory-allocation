import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AddonComponent } from '../components/addon/addon.component';
import { GenericListComponent } from '../components/generic-list/generic-list.component';
import { OrderAllocationComponent } from '../components/order-allocation/order-allocation.component';
import { UserAllocationDialogComponent } from '../components/user-allocation-dialog/user-allocation-dialog.component';
import { WarehouseComponent } from '../components/warehouse/warehouse.component';
import { MaterialModule} from './material.module'
import { PepUIModule} from './pepperi.module'

@NgModule({
    declarations: [
        AddonComponent,
        GenericListComponent,
        WarehouseComponent,
        UserAllocationDialogComponent,
        OrderAllocationComponent,
    ],
    imports: [
        CommonModule,
        PepUIModule,
        MaterialModule
        
    ],
    providers: []
})
export class ComponentsModule {
}

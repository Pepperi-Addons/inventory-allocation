import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AddonComponent } from '../components/addon/addon.component';
import { GenericListComponent } from '../components/generic-list/generic-list.component';
import { WarehouseComponent } from '../components/warehouse/warehouse.component';
import { MaterialModule} from './material.module'
import { PepUIModule} from './pepperi.module'

@NgModule({
    declarations: [
        AddonComponent,
        GenericListComponent,
        WarehouseComponent
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

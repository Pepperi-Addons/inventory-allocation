import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmptyRouteComponent } from './components/empty-route/empty-route.component';
import { AddonComponent } from './components/addon/addon.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
import { OrderAllocationComponent } from './components/order-allocation/order-allocation.component';
// import * as config from '../../../addon.config.json';

const routes: Routes = [
    {
        path: `settings/:addon_uuid`,
        children: [
            {
                path: 'inventory_allocations',
                component: AddonComponent
            },
            {
                path: 'warehouse/:warehouse_id',
                component: WarehouseComponent
            },
            {
                path: 'order_allocation/:order_uuid',
                component: OrderAllocationComponent
            }
        ]
    },
    {
        path: '**',
        component: EmptyRouteComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

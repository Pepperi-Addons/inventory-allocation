import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { PepUIModule } from './modules/pepperi.module';
import { MaterialModule } from './modules/material.module';
import { ComponentsModule } from './modules/components.module';
import { UserAllocationDialogComponent } from './components/user-allocation-dialog/user-allocation-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        UserAllocationDialogComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        PepUIModule,
        MaterialModule,
        ComponentsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}





import jwt from 'jwt-decode';
import { PapiClient } from '@pepperi-addons/papi-sdk';
import { Injectable } from '@angular/core';

import {PepAddonService, PepHttpService, PepDataConvertorService, PepSessionService} from '@pepperi-addons/ngx-lib';

import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';

@Injectable({ providedIn: 'root' })
export class AddonService {

    accessToken = '';
    parsedToken: any
    papiBaseURL = ''
    pluginUUID;

    get papiClient(): PapiClient {
        return new PapiClient({
            baseURL: this.papiBaseURL,
            token: this.session.getIdpToken(),
            addonUUID: this.pluginUUID,
            suppressLogging:true
        })
    }

    constructor(
        public addonService:  PepAddonService
        ,public session:  PepSessionService
        ,public httpService: PepHttpService
        ,public pepperiDataConverter: PepDataConvertorService
        ,public dialogService: PepDialogService
    ) {
        const accessToken = this.session.getIdpToken();
        this.parsedToken = jwt(accessToken);
        this.papiBaseURL = this.parsedToken["pepperi.baseurl"]
    }

    dialogRef;

    openDialog(title = 'Modal Test', content, buttons,
        input , callbackFunc = null): void {
        const dialogConfig = this.dialogService.getDialogConfig({disableClose: true, panelClass:'pepperi-standalone'}, 'inline')
        const data = new PepDialogData({title: title, type:'custom', content:content, actionButtons: buttons})
        dialogConfig.data = data;
        
        this.dialogRef = this.dialogService.openDialog(content, input, dialogConfig);
        this.dialogRef.afterClosed().subscribe(res => {
                    callbackFunc(res);
        });
    }
}

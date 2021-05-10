import { Client } from "@pepperi-addons/debug-server";
import { PapiClient } from "@pepperi-addons/papi-sdk";

export class AddonService {
    papiClient: PapiClient;
    addonUUID: string;
    adal: ReturnType<typeof PapiClient.prototype.addons.data.uuid>;

    constructor(client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client['ActionUUID']
        });
        this.addonUUID = client.AddonUUID;
        this.adal = this.papiClient.addons.data.uuid(this.addonUUID);
    }
}
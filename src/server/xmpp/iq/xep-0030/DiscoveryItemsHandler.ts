import { XML, DiscoveryItems, IqRequestType } from "../../../../library";
import { ClientContext } from "../../context/ClientContext";
import { Handler } from "../../handler/Handler";
import { ServerContext } from "../../context/ServerContext";

export class DiscoveryItemsHandler extends Handler {

    protected discoveryItems = new DiscoveryItems();

    public isIqSupported(server: ServerContext, client: ClientContext, type: IqRequestType, reader: XML): boolean {
        return this.discoveryItems.isRequest(reader);
    }

    public handleIq(server: ServerContext, client: ClientContext, reader: XML): void {
        const request = this.discoveryItems.readRequest(reader);

        client.writeXML(this.discoveryItems.createResponse({
            id: request.id,
            from: server.hostname,
            to: client.jid.stringify(),
            items: [],
        }));
    }
}

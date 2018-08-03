import { XMLReader, DiscoveryInfo, DiscoveryItems } from "../../../../library";
import { ClientContext } from "../../context/ClientContext";
import { Handler } from "../../handler/Handler";
import { ServerContext } from "../../context/ServerContext";
import { JIDHelper } from "../../../../library/util/jid";

export class DiscoveryItemsHandler extends Handler {

    protected discoveryItems = new DiscoveryItems();

    public init(context: ServerContext): void {
        
    }

    public isSupported(server: ServerContext, client: ClientContext, reader: XMLReader): boolean {
        return this.discoveryItems.isRequest(reader);
    }

    public handle(server: ServerContext, client: ClientContext, reader: XMLReader): void {
        const request = this.discoveryItems.readRequest(reader);

        client.writeXML(this.discoveryItems.createResponse({
            id: request.id,
            from: server.hostname,
            to: JIDHelper.toString({ host: server.hostname, name: client.username, resource: client.resource }),
            items: [],
        }));
    }
}

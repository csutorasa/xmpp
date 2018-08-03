import { XMLReader, DiscoveryInfo } from "../../../../library";
import { ClientContext } from "../../context/ClientContext";
import { Handler } from "../../handler/Handler";
import { ServerContext } from "../../context/ServerContext";

export class DiscoveryInfoHandler extends Handler {

    protected discoveryInfo = new DiscoveryInfo();

    public init(context: ServerContext): void {
        
    }

    public isSupported(server: ServerContext, client: ClientContext, reader: XMLReader): boolean {
        return this.discoveryInfo.isRequest(reader);
    }

    public handle(server: ServerContext, client: ClientContext, reader: XMLReader): void {
        const request = this.discoveryInfo.readRequest(reader);

        client.writeXML(this.discoveryInfo.createResponse({
            id: request.id,
            from: server.hostname,
            to: client.jid.stringify(),
            features: [],
            indentities: [],
        }));
    }
}

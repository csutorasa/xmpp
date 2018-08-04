import { XML, DiscoveryInfo, IqRequestType } from "../../../../library";
import { ClientContext } from "../../context/ClientContext";
import { Handler } from "../../handler/Handler";
import { ServerContext } from "../../context/ServerContext";

export class DiscoveryInfoHandler extends Handler {

    protected discoveryInfo = new DiscoveryInfo();

    public isIqSupported(server: ServerContext, client: ClientContext, type: IqRequestType, reader: XML): boolean {
        return this.discoveryInfo.isRequest(reader);
    }

    public handleIq(server: ServerContext, client: ClientContext, reader: XML): void {
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

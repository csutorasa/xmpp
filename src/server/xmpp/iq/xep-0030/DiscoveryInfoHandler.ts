import { DiscoveryInfo, Feature, IqRequestType, XML } from '../../../../library';
import { ClientContext } from '../../context/ClientContext';
import { ServerContext } from '../../context/ServerContext';
import { Handler } from '../../handler/Handler';

export class DiscoveryInfoHandler extends Handler {

    protected discoveryInfo = new DiscoveryInfo();

    public init(context: ServerContext): void {
        const feature: Feature = {
            var: DiscoveryInfo.DISCOVERYINFO_XMLNS,
        };
        context.discoveryInfo.element(this.discoveryInfo.createFeature(feature));
    }

    public isIqSupported(server: ServerContext, client: ClientContext, type: IqRequestType, reader: XML): boolean {
        return this.discoveryInfo.isRequest(reader);
    }

    public handleIq(server: ServerContext, client: ClientContext, reader: XML): void {
        const request = this.discoveryInfo.readRequest(reader);

        client.writeXML(this.discoveryInfo.createResponse({
            id: request.id,
            from: server.hostname,
            to: client.jid.stringify(),
            features: server.discoveryInfo,
        }));
    }
}

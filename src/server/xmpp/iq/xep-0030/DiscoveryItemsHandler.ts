import { DiscoveryInfo, DiscoveryItems, Feature, IqRequestType, XML } from '../../../../library';
import { ClientContext } from '../../context/ClientContext';
import { ServerContext } from '../../context/ServerContext';
import { Handler } from '../../handler/Handler';

export class DiscoveryItemsHandler extends Handler {

    protected discoveryItems = new DiscoveryItems();
    protected discoveryInfo = new DiscoveryInfo();

    public init(context: ServerContext): void {
        const feature: Feature = {
            var: DiscoveryItems.DISCOVERYITEMS_XMLNS,
        };
        context.discoveryInfo.element(this.discoveryInfo.createFeature(feature));
    }

    public isIqSupported(server: ServerContext, client: ClientContext, type: IqRequestType, reader: XML): boolean {
        return this.discoveryItems.isRequest(reader);
    }

    public async handleIq(server: ServerContext, client: ClientContext, reader: XML): Promise<void> {
        const request = this.discoveryItems.readRequest(reader);

        client.writeXML(this.discoveryItems.createResponse({
            id: request.id,
            from: server.hostname,
            to: client.jid.stringify(),
            items: [],
        }));
    }
}

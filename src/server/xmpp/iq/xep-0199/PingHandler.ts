import { DiscoveryInfo, Feature, IqRequestType, Ping, XML } from '../../../../library';
import { ClientContext } from '../../context/ClientContext';
import { ServerContext } from '../../context/ServerContext';
import { Handler } from '../../handler/Handler';

export class PingHandler extends Handler {

    protected ping = new Ping();
    protected discoveryInfo = new DiscoveryInfo();

    public init(context: ServerContext): void {
        const feature: Feature = {
            var: Ping.PING_XMLNS,
        };
        context.discoveryInfo.element(this.discoveryInfo.createFeature(feature));
    }

    public isIqSupported(server: ServerContext, client: ClientContext, type: IqRequestType, reader: XML): boolean {
        return this.ping.isRequest(reader);
    }

    public async handleIq(server: ServerContext, client: ClientContext, reader: XML): Promise<void> {
        const request = this.ping.readRequest(reader);

        client.writeXML(this.ping.createResponse({
            id: request.id,
            from: server.hostname,
            to: client.jid.stringify(),
        }));
    }
}

import { DiscoveryInfo, Feature, IqRequestType, Time, XML } from '../../../../library';
import { ClientContext } from '../../context/ClientContext';
import { ServerContext } from '../../context/ServerContext';
import { Handler } from '../../handler/Handler';

export class TimeHandler extends Handler {

    protected time = new Time();
    protected discoveryInfo = new DiscoveryInfo();

    public init(context: ServerContext): void {
        const feature: Feature = {
            var: Time.TIME_XMLNS,
        };
        context.discoveryInfo.element(this.discoveryInfo.createFeature(feature));
    }

    public isIqSupported(server: ServerContext, client: ClientContext, type: IqRequestType, reader: XML): boolean {
        return this.time.isRequest(reader);
    }

    public handleIq(server: ServerContext, client: ClientContext, reader: XML): void {
        const request = this.time.readRequest(reader);

        client.writeXML(this.time.createResponse({
            id: request.id,
            from: server.hostname,
            to: client.jid.stringify(),
            time: new Date(),
        }));
    }
}

import { DiscoveryInfo, Feature, IqRequestType, Time, XML } from '../../../library';
import { VCard } from '../../../library/iq/VCard';
import { ClientContext } from '../context/ClientContext';
import { ServerContext } from '../context/ServerContext';
import { Handler } from '../handler/Handler';

export class VCardHandler extends Handler {

    protected vCard = new VCard();
    protected discoveryInfo = new DiscoveryInfo();

    public init(context: ServerContext): void {
        const feature: Feature = {
            var: VCard.VCARD_FEATURE_XMLNS,
        };
        // context.discoveryInfo.element(this.discoveryInfo.createFeature(feature));
    }

    public isIqSupported(server: ServerContext, client: ClientContext, type: IqRequestType, reader: XML): boolean {
        return this.vCard.isRequest(reader);
    }

    public handleIq(server: ServerContext, client: ClientContext, reader: XML): void {
        const request = this.vCard.readRequest(reader);

        client.writeXML(this.vCard.createResponse({
            id: request.id,
            from: server.hostname,
            to: client.jid.stringify(),
        }));
    }
}

import { Features, Stream, XMLEvent, XMLEventHelper } from '../../../library';
import { JID } from '../../../library/util/jid';
import { ClientContext, ClientState } from '../context/ClientContext';
import { ServerContext } from '../context/ServerContext';
import { Handler } from '../handler/Handler';

export class OpenStreamHandler extends Handler {
    protected stream = new Stream();
    protected features = new Features();

    public isSingleSupported(server: ServerContext, client: ClientContext, event: XMLEvent): boolean {
        return (client.state === ClientState.Connecting || client.state === ClientState.Authenticated) && this.stream.isOpenStreamMessage(event);
    }

    public async handleSingle(server: ServerContext, client: ClientContext, event: XMLEvent): Promise<void> {
        const request = this.stream.readOpenStreamMessage(event);
        const openStream = this.stream.createOpenStreamMessage({
            from: server.hostname,
            to: request.from,
        });
        if (client.state === ClientState.Connecting) {
            client.jid = new JID(server.hostname);
            client.writeString(openStream);
            client.writeXML(this.features.createFeaturesMessage({
                features: server.authFeatures,
            }));
            client.state = ClientState.Connected;
        } else if (client.state === ClientState.Authenticated) {
            client.writeString(openStream);
            client.writeXML(this.features.createFeaturesMessage({
                features: server.sessionFeatures,
            }));
        }
    }
}

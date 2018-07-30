import { XMLStream, XMLEvent, XMLEventHelper } from "../../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class OpenStreamHandler extends Handler {
    protected xmlStream = new XMLStream();

    public isSingleSupported(server: ServerContext, client: ClientContext, event: XMLEvent): boolean {
        return (client.state === ClientState.Connecting || client.state === ClientState.Authenticated) && XMLEventHelper.is(event, 'open', 'stream:stream');
    }

    public handleSingle(server: ServerContext, client: ClientContext, event: XMLEvent): void {
        const from = event.attributes.from;
        const openStream = this.xmlStream.createOpenStreamMessage(server.hostname, from);
        if(client.state === ClientState.Connecting) {
            client.writeString(openStream);
            client.writeXML(this.xmlStream.createFeaturesMessage(server.features, server.authfeatures));
            client.state = ClientState.Connected;
        } else if(client.state !== ClientState.Authenticated) {
            client.writeString(openStream);
            client.writeXML(this.xmlStream.createFeaturesMessage(server.features));
        }
    }
}
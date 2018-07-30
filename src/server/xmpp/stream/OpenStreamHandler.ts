import { XMLStream, XMLWriter, XMLReader, XMLEvent, XMLEventHelper } from "../../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class OpenStreamHandler extends Handler {
    protected xmlStream = new XMLStream();

    public isSupported(server: ServerContext, client: ClientContext, events: XMLEvent[]): boolean {
        if(client.state !== ClientState.Connecting && client.state !== ClientState.Authenticated) {
            return false;
        }
        return XMLEventHelper.is(events, 'open', 'stream:stream');
    }

    public handle(server: ServerContext, client: ClientContext, events: XMLEvent[]): void {
        const event = XMLEventHelper.processFirst(events);
        const from = event.attributes.from;
        const openStream = this.xmlStream.createOpenStreamMessage(server.hostname, from);
        client.writeString(openStream);
        if(client.state === ClientState.Connecting) {
            client.writeXML(this.xmlStream.createFeaturesMessage(server.features, server.authfeatures));
            client.state = ClientState.Connected;
        } else {
            client.writeXML(this.xmlStream.createFeaturesMessage(server.features));
        }
    }
}
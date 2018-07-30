import { XMLStream, XMLReader, XMLEvent, XMLEventHelper } from "../../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class CloseStreamHandler extends Handler {
    protected xmlStream = new XMLStream();

    public isSupported(server: ServerContext, client: ClientContext, events: XMLEvent[]): boolean {
        return XMLEventHelper.is(events, 'close', 'stream:stream');
    }

    public handle(server: ServerContext, client: ClientContext, events: XMLEvent[]): void {
        const event = XMLEventHelper.processFirst(events);
        client.state = ClientState.Disconnected;
    }
}
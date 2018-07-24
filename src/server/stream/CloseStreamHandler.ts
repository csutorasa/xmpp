import { XMLStream, XMLReader } from "../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";
import { XMLEvent } from "../../library/xml/XMLEvent";
import { XMLEventHelper } from "../../library/xml/XMLEventHelper";


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
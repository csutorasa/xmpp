import { XMLStream, XMLWriter, XMLReader, XMLEvent, XMLEventHelper } from "../../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";

export class InstructionHandler extends Handler {
    protected xmlStream = new XMLStream();

    public isSupported(server: ServerContext, client: ClientContext, events: XMLEvent[]): boolean {
        return events.length > 0 && events[0].type === 'instruction';
    }

    public handle(server: ServerContext, client: ClientContext, events: XMLEvent[]): void {
        XMLEventHelper.processFirst(events);
    }
}
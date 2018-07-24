import { XMLStream, XMLWriter, XMLReader } from "../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";
import { XMLEvent } from "../../library/xml/XMLEvent";
import { XMLEventHelper } from "../../library/xml/XMLEventHelper";


export class InstructionHandler extends Handler {
    protected xmlStream = new XMLStream();

    public isSupported(server: ServerContext, client: ClientContext, events: XMLEvent[]): boolean {
        return events.length > 0 && events[0].type === 'instruction';
    }

    public handle(server: ServerContext, client: ClientContext, events: XMLEvent[]): void {
        XMLEventHelper.processFirst(events);
    }
}
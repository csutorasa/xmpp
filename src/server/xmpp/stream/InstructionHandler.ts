import { XMLStream, XMLWriter, XMLReader, XMLEvent, XMLEventHelper } from "../../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";

export class InstructionHandler extends Handler {
    protected xmlStream = new XMLStream();

    public isSingleSupported(server: ServerContext, client: ClientContext, event: XMLEvent): boolean {
        return event.type === 'instruction';
    }

    public handleSingle(server: ServerContext, client: ClientContext, event: XMLEvent): void {
        
    }
}
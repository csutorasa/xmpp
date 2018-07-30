import { XMLStream, XMLReader, XMLEvent, XMLEventHelper } from "../../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class CloseStreamHandler extends Handler {
    protected xmlStream = new XMLStream();

    public isSingleSupported(server: ServerContext, client: ClientContext, event: XMLEvent): boolean {
        return XMLEventHelper.is(event, 'close', 'stream:stream');
    }

    public handleSingle(server: ServerContext, client: ClientContext, event: XMLEvent): void {
        client.state = ClientState.Disconnected;
    }
}
import { Stream, XMLEvent, XMLEventHelper } from '../../../library';
import { ClientContext, ClientState } from '../context/ClientContext';
import { ServerContext } from '../context/ServerContext';
import { Handler } from '../handler/Handler';

export class CloseStreamHandler extends Handler {
    protected stream = new Stream();

    public isSingleSupported(server: ServerContext, client: ClientContext, event: XMLEvent): boolean {
        return this.stream.isCloseStreamMessage(event);
    }

    public async handleSingle(server: ServerContext, client: ClientContext, event: XMLEvent): Promise<void> {
        client.state = ClientState.Disconnected;
    }
}

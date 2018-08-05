import { XMLEvent, XMLEventHelper } from '../../../library';
import { ClientContext, ClientState } from '../context/ClientContext';
import { ServerContext } from '../context/ServerContext';
import { Handler } from '../handler/Handler';

export class InstructionHandler extends Handler {
    public isSingleSupported(server: ServerContext, client: ClientContext, event: XMLEvent): boolean {
        return event.type === 'instruction';
    }

    public handleSingle(server: ServerContext, client: ClientContext, event: XMLEvent): void {
        // Ignore message
    }
}

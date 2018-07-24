import { XMLStream, XMLWriter } from "../../../library";
import { ClientContext, ClientState } from "../../context/ClientContext";
import { Handler } from "../../handler/Handler";
import { ServerContext } from "../../context/ServerContext";
import { XMLEvent } from "../../../library/xml/XMLEvent";


export class NonSASLAuthenticationHandler extends Handler {
    protected xmlStream = new XMLStream();

    public init(context: ServerContext): void {
        context.authfeatures.element('auth', XMLWriter.create().xmlns('', 'http://jabber.org/features/iq-auth'));
    }

    public isSupported(server: ServerContext, client: ClientContext, events: XMLEvent[]): boolean {
        return false;
    }

    public handle(server: ServerContext, client: ClientContext, events: XMLEvent[]): void {
        
    }
}
import { XMLStream, XMLWriter, XMLReader } from "../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";
import { XMLEvent } from "../../library/xml/XMLEvent";
import { XMLEventHelper } from "../../library/xml/XMLEventHelper";


export class PlainAuthHandler extends Handler {
    protected xmlStream = new XMLStream();

    public init(context: ServerContext): void {
        context.authfeatures.element('mechanisms', XMLWriter.create().xmlns('', XMLStream.MECHANISMS_XMLNS)
            .element('mechanism', XMLWriter.create().text('PLAIN'))
        )
    }

    public isSupported(server: ServerContext, client: ClientContext, events: XMLEvent[]): boolean {
        if (!XMLEventHelper.is(events, 'open', 'auth')) {
            return false;
        }
        const tag = XMLEventHelper.getTag(events).getElement('auth');
        return tag != null && tag.getAttr('mechanism') === 'PLAIN';
    }

    public handle(server: ServerContext, client: ClientContext, events: XMLEvent[]): void {
        const auth = XMLEventHelper.processTag(events).getElement('auth');
        console.log('auth', auth.getContent());
        client.state = ClientState.Authenticated;
        client.username = 'demo';
        const success = XMLWriter.create().element('success', XMLWriter.create().xmlns('', 'urn:ietf:params:xml:ns:xmpp-sasl'));
        client.writeXML(success);
    }
}
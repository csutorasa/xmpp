import { Stream, XMLWriter, XMLReader } from "../../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class PlainAuthHandler extends Handler {
    public init(context: ServerContext): void {
        context.authfeatures.element('mechanisms', XMLWriter.create().xmlns('', Stream.MECHANISMS_XMLNS)
            .element('mechanism', XMLWriter.create().text('PLAIN'))
        )
    }

    public isSupported(server: ServerContext, client: ClientContext, reader: XMLReader): boolean {
        const tag = reader.getElement('auth');
        return tag != null && tag.getAttr('mechanism') === 'PLAIN';
    }

    public handle(server: ServerContext, client: ClientContext, reader: XMLReader): void {
        const auth = reader.getElement('auth');
        console.log('auth', auth.getContent());
        client.state = ClientState.Authenticated;
        client.username = 'demo';
        const success = XMLWriter.create().element('success', XMLWriter.create().xmlns('', 'urn:ietf:params:xml:ns:xmpp-sasl'));
        client.writeXML(success);
    }
}
import { XMLStream, XMLWriter, XMLReader } from "../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class PlainAuthHandler extends Handler {
    protected xmlStream = new XMLStream();

    public init(context: ServerContext): void {
        context.authfeatures.element('mechanisms', XMLWriter.create().xmlns('', XMLStream.MECHANISMS_XMLNS)
            .element('mechanism', XMLWriter.create().text('PLAIN'))
        )
    }

    public isSupported(server: ServerContext, client: ClientContext, request: XMLReader): boolean {
        const auth = request.getElement('auth')
        return auth != null && auth.getAttr('mechanism') === 'PLAIN';
    }

    public handle(server: ServerContext, client: ClientContext, request: XMLReader): void {
        const auth = request.getElement('auth')
        console.log('auth', auth.getContent());
        client.state = ClientState.Authenticated;
        client.username = 'demo';
        const success = XMLWriter.create().element('success', XMLWriter.create().xmlns('', 'urn:ietf:params:xml:ns:xmpp-sasl'));
        client.write(success);
    }
}
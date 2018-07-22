import { XMLStream, XMLWriter, XMLReader } from "../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class BindHandler extends Handler {
    protected xmlStream = new XMLStream();

    public init(context: ServerContext): void {
        context.features.element('bind', XMLWriter.create().xmlns('', XMLStream.BIND_XMLNS));
    }

    public isSupported(server: ServerContext, client: ClientContext, request: XMLReader): boolean {
        const iq = request.getElement('iq')
        return iq != null && iq.getAttr('type') === 'set' && iq.getElement('bind') && iq.getElement('bind').getXmlns('') == XMLStream.BIND_XMLNS
            && iq.getElement('bind').getElement('resource') && iq.getElement('bind').getElement('resource').getContent() != null;
    }

    public handle(server: ServerContext, client: ClientContext, request: XMLReader): void {
        const iq = request.getElement('iq');
        client.resource = iq.getElement('bind').getElement('resource') ? iq.getElement('bind').getElement('resource').getContent() : 'randomresource';
        client.write(XMLWriter.create()
            .element('iq', XMLWriter.create()
                .attr('type', 'result')
                .attr('id', request.getElement('iq').getAttr('id'))
                .attr('to', server.hostname + '/' + client.resource)
                .element('bind', XMLWriter.create()
                    .xmlns('', 'urn:ietf:params:xml:ns:xmpp-bind')
                    .element('jid', XMLWriter.create().text(client.username + '@' + server.hostname + '/' + client.resource))
                )
            )
        )
    }
}
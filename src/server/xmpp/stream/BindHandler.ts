import { XMLStream, XMLWriter, XMLReader, XMLEvent, XMLEventHelper } from "../../../library";
import { ClientContext } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class BindHandler extends Handler {
    protected xmlStream = new XMLStream();

    public init(context: ServerContext): void {
        context.features.element('bind', XMLWriter.create().xmlns('', XMLStream.BIND_XMLNS));
    }

    public isSupported(server: ServerContext, client: ClientContext, reader: XMLReader): boolean {
        const iq = reader.getElement('iq');
        return iq != null && iq.getAttr('type') === 'set' && iq.getElement('bind') && iq.getElement('bind').getXmlns('') == XMLStream.BIND_XMLNS
            && iq.getElement('bind').getElement('resource') && iq.getElement('bind').getElement('resource').getContent() != null;
    }

    public handle(server: ServerContext, client: ClientContext, reader: XMLReader): void {
        const iq = reader.getElement('iq');
        client.resource = iq.getElement('bind').getElement('resource') ? iq.getElement('bind').getElement('resource').getContent() : 'randomresource';
        client.writeXML(XMLWriter.create()
            .element('iq', XMLWriter.create()
                .attr('type', 'result')
                .attr('id', iq.getAttr('id'))
                .attr('to', server.hostname + '/' + client.resource)
                .element('bind', XMLWriter.create()
                    .xmlns('', 'urn:ietf:params:xml:ns:xmpp-bind')
                    .element('jid', XMLWriter.create().text(client.username + '@' + server.hostname + '/' + client.resource))
                )
            )
        )
    }
}
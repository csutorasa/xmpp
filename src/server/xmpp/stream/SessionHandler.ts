import { XMLStream, XMLWriter, XMLReader, XMLEvent, XMLEventHelper } from "../../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class SessionHandler extends Handler {
    protected xmlStream = new XMLStream();

    public init(context: ServerContext): void {
        context.features.element('bind', XMLWriter.create().xmlns('', XMLStream.BIND_XMLNS));
    }

    public isSupported(server: ServerContext, client: ClientContext, reader: XMLReader): boolean {
        const iq = reader.getElement('iq');
        return iq != null && iq.getAttr('type') === 'set' && iq.getElement('session') && iq.getElement('session').getXmlns('') == XMLStream.SESSION_XMLNS;
    }

    public handle(server: ServerContext, client: ClientContext, reader: XMLReader): void {
        const iq = reader.getElement('iq');
        client.writeXML(XMLWriter.create()
            .element('iq', XMLWriter.create()
                .attr('type', 'result')
                .attr('from', server.hostname)
                .attr('id', iq.getAttr('id'))
            )
        )
    }
}
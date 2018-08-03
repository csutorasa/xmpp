import { XMLWriter, XMLReader, Bind } from "../../../library";
import { ClientContext } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class BindHandler extends Handler {

    protected bind = new Bind();

    public init(context: ServerContext): void {
        context.features.element(XMLWriter.create('bind').xmlns('', Bind.BIND_XMLNS));
    }

    public isSupported(server: ServerContext, client: ClientContext, reader: XMLReader): boolean {
        return this.bind.isRequest(reader);
    }

    public handle(server: ServerContext, client: ClientContext, reader: XMLReader): void {
        const request = this.bind.readRequest(reader);
        client.resource = request.resource ? request.resource : 'randomresource';

        client.writeXML(this.bind.createResponse({
            id: request.id,
            jid: {
                host: server.hostname,
                name: client.username,
                resource: client.resource,
            }
        }));
    }
}
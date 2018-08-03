import { XMLWriter, XMLReader, Bind, IqRequestType } from "../../../library";
import { ClientContext } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class BindHandler extends Handler {

    protected bind = new Bind();

    public init(context: ServerContext): void {
        context.sessionFeatures.element(XMLWriter.create('bind').xmlns('', Bind.BIND_XMLNS));
    }

    public isIqSupported(server: ServerContext, client: ClientContext, type: IqRequestType, reader: XMLReader): boolean {
        return this.bind.isRequest(reader);
    }

    public handleIq(server: ServerContext, client: ClientContext, reader: XMLReader): void {
        const request = this.bind.readRequest(reader);
        client.jid.resource = request.resource ? request.resource : 'randomresource';

        client.writeXML(this.bind.createResponse({
            id: request.id,
            jid: client.jid,
        }));
    }
}
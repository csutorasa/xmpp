import { XMLReader, Session, XMLWriter, IqRequestType } from "../../../library";
import { ClientContext } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class SessionHandler extends Handler {
    protected session = new Session();

    public init(context: ServerContext): void {
        context.sessionFeatures.element(XMLWriter.create('session').xmlns('', Session.SESSION_XMLNS));
    }

    public isIqSupported(server: ServerContext, client: ClientContext, type: IqRequestType, reader: XMLReader): boolean {
        return this.session.isRequest(reader);
    }

    public handleIq(server: ServerContext, client: ClientContext, reader: XMLReader): void {
        const request = this.session.readRequest(reader);
        client.writeXML(this.session.createResponse({
            id: request.id,
            host: server.hostname
        }));
    }
}
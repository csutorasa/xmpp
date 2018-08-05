import { IqRequestType, Session, XML } from '../../../library';
import { ClientContext } from '../context/ClientContext';
import { ServerContext } from '../context/ServerContext';
import { Handler } from '../handler/Handler';

export class SessionHandler extends Handler {
    protected session = new Session();

    public init(context: ServerContext): void {
        context.sessionFeatures.element(XML.create('session').xmlns('', Session.SESSION_XMLNS));
    }

    public isIqSupported(server: ServerContext, client: ClientContext, type: IqRequestType, reader: XML): boolean {
        return this.session.isRequest(reader);
    }

    public handleIq(server: ServerContext, client: ClientContext, reader: XML): void {
        const request = this.session.readRequest(reader);
        client.writeXML(this.session.createResponse({
            id: request.id,
            host: server.hostname,
        }));
    }
}

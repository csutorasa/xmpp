import { IqRequestType, Roster, XML } from '../../../library';
import { ClientContext } from '../context/ClientContext';
import { ServerContext } from '../context/ServerContext';
import { Handler } from '../handler/Handler';

export class RosterHandler extends Handler {

    protected roster = new Roster();

    public init(context: ServerContext): void {
        context.sessionFeatures.element(XML.create('bind').xmlns('', Roster.ROSTER_XMLNS));
    }

    public isIqSupported(server: ServerContext, client: ClientContext, type: IqRequestType, reader: XML): boolean {
        return this.roster.isRequest(reader);
    }

    public handleIq(server: ServerContext, client: ClientContext, reader: XML): void {
        const request = this.roster.readRequest(reader);
        client.writeXML(this.roster.createResponse({
            id: request.id,
            from: server.hostname,
            to: client.jid.stringify(),
            items: [],
        }));
    }
}

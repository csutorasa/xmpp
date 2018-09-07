import { ILogger, IqRequestType, LoggerFactory, Roster, XML } from '../../../library';
import { JID } from '../../../library/util/jid';
import { ClientContext } from '../context/ClientContext';
import { ServerContext } from '../context/ServerContext';
import { Handler } from '../handler/Handler';
import { User } from '../manager/User';
import { UserManager } from '../manager/UserManager';

export class RosterHandler extends Handler {

    private static readonly log: ILogger = LoggerFactory.create(RosterHandler);

    protected roster = new Roster();

    public init(context: ServerContext): void {
        context.sessionFeatures.element(XML.create('roster').xmlns('', Roster.ROSTER_XMLNS));
    }

    public isIqSupported(server: ServerContext, client: ClientContext, type: IqRequestType, reader: XML): boolean {
        return this.roster.isRequest(reader);
    }

    public handleIq(server: ServerContext, client: ClientContext, reader: XML): void {
        const request = this.roster.readRequest(reader);
        const me: User = UserManager.getCurrentUser(client); // TODO have to be changed to "SessionManager.getCurrentUser(client);"" to force authentication
        RosterHandler.log.info(me ? 'me:' + me.name : 'me is undefined');
        if ('set'.localeCompare(request.type) === 0) {
            const partner: User = UserManager.getUser(request.jid);
            RosterHandler.log.info('jid(' + request.jid + '): ' + (partner ? 'adding partner:' + partner.name : 'partner is undefined'));
            if (partner) {
                me.addPartner(partner);
            } else {
                // TODO: error handling
            }
        }
        client.writeXML(this.roster.createResponse({
            id: request.id,
            from: server.hostname,
            to: client.jid.stringify(),
            items: me ? me.getRosters() : [],
        }));
    }
}

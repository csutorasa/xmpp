import { ILogger, IqRequestType, LoggerFactory, Roster, XML } from '../../../library';
import { Presence } from '../../../library/iq/Presence';
import { PresenceResponseType } from '../../../library/iq/PresenceBase';
import { JID } from '../../../library/util/jid';
import { ClientContext } from '../context/ClientContext';
import { ServerContext } from '../context/ServerContext';
import { Handler } from '../handler/Handler';
import { User } from '../manager/User';
import { UserManager } from '../manager/UserManager';

export class PresenceHandler extends Handler {

    private static readonly log: ILogger = LoggerFactory.create(PresenceHandler);

    protected presence = new Presence();

    public init(context: ServerContext): void {
        context.sessionFeatures.element(XML.create('presence'));
    }

    public isSupported(server: ServerContext, client: ClientContext, reader: XML): boolean {
        PresenceHandler.log.info(this.presence.isRequest(reader) ? 'isRequest' : 'not isRequest');
        return this.presence.isRequest(reader);
    }

    public async handle(server: ServerContext, client: ClientContext, reader: XML): Promise<void> {
        const request = this.presence.readRequest(reader);
        const me: User = UserManager.getCurrentUser(client); // TODO have to be changed to "SessionManager.getCurrentUser(client);"" to force authentication
        // PresenceHandler.log.info(me ? 'me:' + me.name : 'me is undefined');
        PresenceHandler.log.info('request.type' + request.type ? request.type : 'null');
        let t: PresenceResponseType = 'unavailable';
        // if (request.type) {
        switch (request.type) {
                case 'subscribe':
                    t = 'subscribed';
                    break;
                case 'unsubscribe':
                    t = 'unsubscribed';
                    break;
                case undefined: // Own presence: Hello, I'm here!
                        // t = 'unsubscribed';
                        // break;
                        // this.presence.sendPresenceToClient('a@d', client);
                        // this.presence.sendPresenceToClient(me.name, request.to, client); // TODO
                        this.presence.sendPresenceToClient('fsatrio@localhost', me.name, client); // TODO
                        this.presence.sendPresenceToClient('c@localhost', me.name, client); // TODO
                        return;
                default:
                    t = 'error';
                    break;
            }
        // }
        client.writeXML(this.presence.createResponse({
            from: me.name,
            to: request.to,
            type:  t,
        }));
    }
}

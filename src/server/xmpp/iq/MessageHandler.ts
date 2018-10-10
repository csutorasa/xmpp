import { ILogger, IqRequestType, LoggerFactory, Roster, XML } from '../../../library';
import { Message } from '../../../library/iq/Message';
import { MessageResponse } from '../../../library/iq/MessageBase';
import { JID } from '../../../library/util/jid';
import { ClientContext } from '../context/ClientContext';
import { ServerContext } from '../context/ServerContext';
import { Handler } from '../handler/Handler';
import { Router } from '../manager/Router';
import { SessionManager } from '../manager/SessionManager';
import { User } from '../manager/User';
import { UserManager } from '../manager/UserManager';

export class MessageHandler extends Handler {

    private static readonly log: ILogger = LoggerFactory.create(MessageHandler);

    protected message = new Message();

    public init(context: ServerContext): void {
        context.sessionFeatures.element(XML.create('message'));
    }

    public isSupported(server: ServerContext, client: ClientContext, reader: XML): boolean {
        MessageHandler.log.info(this.message.isRequest(reader) ? 'supported' : 'not supported');
        return this.message.isRequest(reader);
    }

    public async handle(server: ServerContext, client: ClientContext, reader: XML): Promise<void> {
        MessageHandler.log.info('JID: ' + JSON.stringify(client.jid));
        const request = this.message.readRequest(reader);
        // SessionManager.g
        const me: User = UserManager.getCurrentUser(client); // TODO have to be changed to "SessionManager.getCurrentUser(client);"" to force authentication
        // MessageHandler.log.info(me ? 'me:' + me.name : 'me is undefined');
        MessageHandler.log.info('request.id: ' + request.id);
        MessageHandler.log.info('request.from: ' + me.name);
        MessageHandler.log.info('request.to: ' + request.to);
        MessageHandler.log.info('request.type: ' + request.type ? request.type : 'null');
        MessageHandler.log.info('request.body: ' + (request.body ? JSON.stringify(request.body.getContent()) : ''));
        /*

        // if (request.type) {
        switch (request.type) {
                case 'subscribe':
                    t = 'subscribed';
                    break;
                case 'unsubscribe':
                    t = 'unsubscribed';
                    break;
                case undefined: // Own message: Hello, I'm here!
                        // t = 'unsubscribed';
                        // break;
                        this.message.sendMessageToClient('a@d', client);
                        return;
                default:
                    t = 'error';
                    break;
            }
        // }
        */
        const toJID: JID = JID.parse(request.to);
        const to: string = toJID.getUser();
        MessageHandler.log.info('toJID: ' + JSON.stringify(toJID));
        const mr: MessageResponse = { from: client.jid, to: JID.parse(request.to).getUser(), type: request.type, body: request.body };
        Router.sendMessageToUser(mr, null, client); // Forward it to the 'to'
        // Router.sendMessageToUser(mr, client.jid, client); // Echo it to itself, except the same client, called Carbons, see: xep-0280
    }
}

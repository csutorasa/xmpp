import { ILogger, IqRequestType, LoggerFactory, Roster, XML } from '../../../library';
import { Message } from '../../../library/iq/Message';
import { JID } from '../../../library/util/jid';
import { ClientContext } from '../context/ClientContext';
import { ServerContext } from '../context/ServerContext';
import { Handler } from '../handler/Handler';
import { Router } from '../manager/Router';
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
        const request = this.message.readRequest(reader);
        const me: User = UserManager.getCurrentUser(client); // TODO have to be changed to "SessionManager.getCurrentUser(client);"" to force authentication
        // MessageHandler.log.info(me ? 'me:' + me.name : 'me is undefined');
        MessageHandler.log.info('request.type: ' + request.type ? request.type : 'null');
        MessageHandler.log.info('request.to: ' + request.to);
        /*let t: MessageResponseType = 'unavailable';

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
        Router.sendMessageToUser(client.jid, JID.parse(request.to).getUser(), request.type, request.body);
        /*client.writeXML(this.message.createResponse({
            from: request.to,
            to: me.name,
            type:  request.type,
            body: request.body,
        }));*/
    }
}

import { ILogger, LoggerFactory, XML } from '../../../library';
import { MessageBase } from '../../../library/iq/MessageBase';
import { JID } from '../../../library/util/jid';
import { ClientContext } from '../context/ClientContext';
import { SessionManager } from './SessionManager';

export class Router {

    // public static SystemJID: JID = new JID("System", "Server", "Server");

    public static sendMessageToClient(from: JID, client: ClientContext, type: string, msg: string|XML) {
        if (!client) {
            return; // TODO
        }
        const to: string = client.jid ? client.jid.getBindedUser() : '';
        client.writeXML(MessageBase.createMessage(from.getBindedUser(), to , type,  msg));
    }

    public static sendMessageToJID(from: JID, to: JID, type: string, msg: string|XML) {
        if (!to) {
            return; // TODO
        }
        if (to.hasResource()) {
            Router.log.info('sendMessageToJID: to: ' + JSON.stringify(to));
            const client: ClientContext = SessionManager.getClientForJID(to);
            Router.sendMessageToClient(from, client, type, msg);
        } else {
            Router.sendMessageToUser(from, to.getUser(), type, msg);
        }
    }

    public static sendMessageToBind(from: JID, bind: string, type: string, msg: string|XML) {
        Router.sendMessageToJID(from, JID.parse(bind), type, msg);
    }

    public static sendMessageToUser(from: JID, to: string, type: string, msg: string|XML) {
        const clients: ClientContext[] = SessionManager.getClientsForUser(to);
        Router.log.info(JSON.stringify(clients));
        clients.forEach((c) => {Router.sendMessageToClient(from, c, type, msg); });

    }

    private static readonly log: ILogger = LoggerFactory.create(Router);
}

import { ILogger, LoggerFactory, XML } from '../../../library';
import { MessageBase, MessageResponse } from '../../../library/iq/MessageBase';
import { JID } from '../../../library/util/jid';
import { ClientContext } from '../context/ClientContext';
import { SessionManager } from './SessionManager';

export class Router {

    // public static SystemJID: JID = new JID("System", "Server", "Server");

    /**
     * Main function: all other will call this finally because writeXML needs a ClientContext.
     * Only one message into one channel.
     */
    public static sendMessageToClient(from: string|JID, client: ClientContext, type: string, msg: string|XML, toOverride?: JID|string) {
        if (!client) {
            Router.log.warn('sendMessageToClient: client is null' + JSON.stringify(from));
            return; // TODO
        }
        // Target: client's JID is the default, but sometimes the channel (client) and the target (to) in the message is not the same (e.g. EchoService response or self echo)
        const to: string = (toOverride instanceof JID ? toOverride.getUser() : toOverride) || (client.jid ? client.jid.getUser() : '');
        Router.log.info('sendMessageToClient: from: ' + JSON.stringify(from) + ' to: ' + JSON.stringify(to) + ' via: ' + (client.jid.stringify()));
        client.writeXML(MessageBase.createMessageNative(from, to , type,  msg));
    }

    /**
     * Translates JID to client(s)
     * One or more messages, based on the presence of JID's resource.
     */
    public static sendMessageToJID(from: JID, to: JID, type: string, body: string|XML) {
        if (!to) {
            Router.log.warn('sendMessageToJID: to is null' + JSON.stringify(from));
            return; // TODO
        }
        Router.log.info('sendMessageToJID: to: ' + JSON.stringify(to));
        if (to.hasResource()) { // Specific client
            const client: ClientContext = SessionManager.getClientForJID(to);
            Router.sendMessageToClient(from, client, type, body);
        } else { // All clients
            const mr: MessageResponse = { from, to, type, body };
            Router.sendMessageToUser(mr);
        }
    }

    /** Wrapper to sendMessageToJID */
    public static sendMessageToBind(from: JID, bind: string, type: string, msg: string|XML) {
        if (!bind) {
            Router.log.warn('sendMessageToBind: bind is null' + JSON.stringify(from));
            return; // TODO
        }
        Router.sendMessageToJID(from, JID.parse(bind), type, msg);
    }

    /** Distributes messages to all clients of the specified user */
    public static sendMessageToUser(msg: MessageResponse, toOverride?: string|JID, exception?: ClientContext) {
        Router.log.info('sendMessageToUser: msg:' + JSON.stringify(msg) + ', toOverride: ' + JSON.stringify(toOverride) + ', exception: ' + JSON.stringify(exception));
        const to2: string|JID = toOverride ? toOverride : msg.to;
        const to: string = to2 instanceof JID ? to2.getUser() : to2;
        const type: string = msg.type;
        const body: string|XML = msg.body;

        Router.log.info('sendMessageToUser: to2:' + JSON.stringify(to2) + ', to: ' + JSON.stringify(to));

        if (!to) {
            Router.log.warn('sendMessageToUser: to is null' + JSON.stringify(msg.from));
            return; // TODO
        }
        const clients: ClientContext[] = SessionManager.getClientsForUser(to);
        Router.log.info(JSON.stringify(clients));
        clients.filter((c) => (c != exception)).forEach((c) => {Router.sendMessageToClient(msg.from, c, type, body); });

    }

    private static readonly log: ILogger = LoggerFactory.create(Router);
}

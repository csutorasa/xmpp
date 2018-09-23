import { ILogger, LoggerFactory } from '../../../library';
import { JID } from '../../../library/util/jid';
import { ClientContext } from '../context/ClientContext';

interface Bindings {
    [resource: string]: ClientContext;
}

interface SessionGroups {
    [user: string]: Bindings;
}

export class SessionManager {

    public static add(client: ClientContext ): boolean {
        if (client.jid == null) {
            SessionManager.log.warn('Client has no JID.' + JSON.stringify(client));
            return false;
        }
        const jid = client.jid;
        const user: string = jid.getUser();
        const resource: string = jid.resource;
        const bind: string = jid.getBindedUser();

        SessionManager.log.info('user: ' + user);
        SessionManager.log.info('resource: ' + resource);

        let b: Bindings = {};

        if (this.sessions[user] == null) {
            SessionManager.log.info('new user: ' + bind);
            this.sessions[user] = b;
        } else {
            SessionManager.log.info('new resource: ' + bind);
            b = this.sessions[user];
        }
        // if (b[resource] === null) {
        b[resource] = client;
        // }
        SessionManager.log.info('sessions: ' + JSON.stringify(this.sessions));

        const msg: string = 'Wellcome ' + bind + '!';

        // Router.sendMessageToClient('System', client, 'chat', msg);
        // Router.sendMessageToBind('System', bind, 'chat', msg);
        // Router.sendMessageToUser('System', user, 'chat', msg);

        return true;
    }

    public static getClientForJID(jid: JID): ClientContext {
        const user: string = jid.getUser();
        const b: Bindings = this.sessions[user];
        if (b == null) {
            SessionManager.log.info('no sessions for user: ' + user + ', jid: ' + jid);
            SessionManager.log.info('sessions: ' + JSON.stringify(this.sessions));
            return null;
        }
        const resource: string = jid.resource;
        return b[resource];
    }

    public static getClientForBind(bind: string): ClientContext {
        return this.getClientForJID(JID.parse(bind));
    }

    public static getClientsForUser(user: string): ClientContext[] {
        const ret: ClientContext[] = [];
        const b: Bindings = this.sessions[user];
        if (b == null) {
            SessionManager.log.info('no sessions for user: ' + user);
            SessionManager.log.info('sessions: ' + JSON.stringify(this.sessions));
            return ret;
        }

        for (const resource in b) {
            if (resource) {
                const client: ClientContext = b[resource];
                if (client && client.jid) {
                        ret.push(client);
                }
            }
        }
        SessionManager.log.info('sessions for user: ' + user + JSON.stringify(ret));
        return ret;
    }

    protected static sessions: SessionGroups = {};
    private static readonly log: ILogger = LoggerFactory.create(SessionManager);

    /*private static getBindings(user: string): Bindings {
        const ret: Bindings = {};

        const b: Bindings = this.sessions[user];
        if (b == null) {
            return ret;
        }

        for (const resource in b) {
            const client: ClientContext = b[resource];
            if (client.jid) {
                const resource: string = client.jid.resource;
                ret[resource] = client;
             }
        }
        return ret;
    }*/
}

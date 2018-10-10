import { ILogger, LoggerFactory, Roster, RosterItem } from '../../../library';
import { JID } from '../../../library/util/jid';
import { UserRepository } from '../../database/UserRepository';
import { Ldap } from '../../ldap/Ldap';
import { ClientContext } from '../context/ClientContext';
import { XMPPServer } from '../server/XMPPServer';
import { EchoService } from '../service/EchoService';
import { SessionManager } from './SessionManager';
import { User, Users } from './User';

export class UserManager {

    public static getUser(name: string): User {
        this.createDefaultUsers(); // TODO Move this into some init function
        const user: User = this.users[name];
        return user;
    }

    public static getUserFromJID(jid: JID): User {
        if (!jid) {
            return null;
        }
        const name = jid.getUser();
        if (!name) {
            return null;
        }
        return this.getUser (name);
    }

    public static createUser(userName: string): User {
        let userX: User = this.getUser(userName);
        if (!userX) {
            userX = new User(userName);
            this.users[userName] = userX;
        }
        return userX;
    }

    public static getCurrentUser(client: ClientContext): User {
        if (!client) {
            return null;
        }
        return this.getUserFromJID(client.jid);
    }

    public static async createDefaultUsers() {
        if (!this.users) {
            this.users = {};
            const serverName: string = 'localhost';
            // System User
            const sysUser: User = this.createUser('system@' + serverName);

            // Echo User
            const echoServiceName: string = 'echoservice@' + serverName;
            const echoServiceJID: string = echoServiceName + '/server';
            const echoUser: User = this.createUser(echoServiceName);
            const echoContext: ClientContext = EchoService.getClientContext(echoServiceJID);
            SessionManager.add(echoContext);

            // TODO sync should be called on serverstart and time to time not on this event
            const ldap = new Ldap();
            await ldap.sync();

            const ur = new UserRepository();
            let users: User[];
            await ur.queryAll().then( async (res) => { await res.toArray().then((data) => {
                data.forEach((element) => {
                    this.createUser(element.name1 + '@' + serverName);
                }); }); }).catch((err) => {UserManager.log.error(err); });

            // Other test users
            // const a: User = this.createUser('fsatrio@' + serverName).addPartner(echoUser);
            // const b: User = this.createUser('b@' + serverName).addPartner(echoUser).addPartner(a);
            // const c: User = this.createUser('c@' + serverName).addPartner(echoUser).addPartner(a).addPartner(b);
        }
    }

    protected static users: Users = null;

    protected static tempDefaultUsersCreated: boolean = false;

    private static readonly log: ILogger = LoggerFactory.create(UserManager);
}

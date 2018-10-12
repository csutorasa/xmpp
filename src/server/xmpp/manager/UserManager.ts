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

    public static createUser(userName: string): User {
        let userX: User = this.getUser(userName);
        if (!userX) {
            userX = new User(userName);
            this.users[userName] = userX;
        }
        return userX;
    }

    public static getUser(name: string): User {
        // this.createDefaultUsers(); // TODO Move this into some init function
        const user: User = this.users[name];
        return user;
    }

    public static getCurrentUser(client: ClientContext): User {
        if (!client) {
            UserManager.log.warn('client is undefined');
            return null;
        }
        const u: User = this.getUserFromJID(client.jid);
        if (!u) {
            UserManager.log.warn('user is undefined for client: ' + client.jid.stringify());
            UserManager.log.info(JSON.stringify(this.users));
        }
        return u;
    }

    public static async createDefaultUsers() {
        if (!UserManager.tempDefaultUsersCreated) {
            UserManager.tempDefaultUsersCreated = true;
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
            // let users: User[];
            await ur.queryAll().then( async (res) => { await res.toArray().then((data) => {
                data.forEach((element) => {
                    this.createUser(element.name1 + '@' + serverName);
                }); }); }).catch((err) => {UserManager.log.error(err); });

            const aaa: User = this.getUser('aaa@' + serverName).addPartner(echoUser);
            const bbb: User = this.getUser('bbb@' + serverName).addPartner(echoUser).addPartner(aaa);
            const loxon: User = this.getUser('loxon@' + serverName);
            const hci: User = this.getUser('hci@' + serverName).addPartner(loxon);
            loxon.addPartner(hci);
            UserManager.log.info(JSON.stringify(this.users));
        }
    }

    protected static users: Users = null;

    protected static tempDefaultUsersCreated: boolean = false;

    private static readonly log: ILogger = LoggerFactory.create(UserManager);

    private static getUserFromJID(jid: JID): User {
        if (!jid) {
            return null;
        }
        const name = jid.getUser();
        if (!name) {
            return null;
        }
        return this.getUser (name);
    }
}

import { ILogger, LoggerFactory } from '../../../library';
import { User, Users } from './User';
import { UserManager } from './UserManager';
import { Group, Groups } from './Group';

export class GroupManager {

    public static addUserToGroup(userName: string, groupName: string ): boolean {
        const userX: User = UserManager.getUser(userName);
        if(!userX)
        {
            return false;
        }

        let group: Group = this.groups[groupName];
        if(!group)
        {
            group = new Group(groupName);
            this.groups[groupName] = group;
        }
        //userX.addToGroup(group);
        group.addUser(userX); // Not symetric!

        return true;
    }

    public static getGroupUsers(groupName: string): Users {
        /*const ret: ClientContext[] = [];
        const b: Bindings = this.sessions[user];
        if (b == null) {
            return ret;
        }

        for (const resource in b) {
            if (b) {
                const client: ClientContext = b[resource];
                if (client.jid) {
                    ret.push(client);
                }
            }
        }
        return ret;*/
        return {};
    }

    public static getUserGroups(userName: string): Groups {
        /*const ret: Groups = {};
        const b: Bindings = this.sessions[user];
        if (b == null) {
            return ret;
        }

        for (const resource in b) {
            if (b) {
                const client: ClientContext = b[resource];
                if (client.jid) {
                    ret.push(client);
                }
            }
        }
        return ret;*/
        return {};
    }

    protected static groups: Groups = {};
    //protected static users: Users = {};

    private static readonly log: ILogger = LoggerFactory.create(GroupManager);

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

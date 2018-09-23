import { User, Users } from './User';

/**
 * Group of users
 */
export class Group {
    users: Users = {};

    public constructor (public name: string) {}

    public addUser(user: User)
    {
        this.users[user.name] = user;
    }
}

export interface Groups {
    [group: string]: Group;
}


import { ILogger, LoggerFactory, RosterItem } from '../../../library';
import { JID } from '../../../library/util/jid';

export interface Users {
    [user: string]: User;
}

export class User {

   // private static readonly log: ILogger = LoggerFactory.create(User);

    public partners: Users = {}; // TODO: has to be persisted with subscription info
    public presence: boolean = false;

    public constructor(public name: string) {}

    public addPartner(partner: User): User {
        if (partner) {
            this.partners[partner.name] = partner;
        }
        return this;
    }

    // TODO
    public getRosters(): RosterItem[] {
        const ret: RosterItem[] = [];
        const users: Users = this.partners;
        for (const uName in users) {
            if (uName) {
                const user: User = users[uName];
                if (user) {
                    const ri: RosterItem =  {
                        jid: uName, // JID.parse(uName),
                        name: 'roster name',
                        subscription: 'both',
                        groups: ['group'],
                    };
                    if (ri) {
                        ret.push(ri);
                    }
                }
            }
        }
        return ret;
    }
}

import { ILogger, LoggerFactory, RosterItem } from '../../../library';
// import { JID } from '../../../library/util/jid';
import { Subscription, SubscriptionRepository } from '../../database/SubscriptionRepository';

export interface Users {
    [user: string]: User;
}

export class User {
   // private static readonly log: ILogger = LoggerFactory.create(User);

    public partners: Users = {}; // TODO: has to be persisted with subscription info
    public presence: boolean = false;
    public emailAddress: string;
public RosterItem;
    public constructor(public name: string) {}

    public addPartner(partner: User): User {
        if (partner) {
            if (this.partners[partner.name] === null) {
                this.partners[partner.name] = partner;
                /* TODO
                const sr: SubscriptionRepository = new SubscriptionRepository();
                const s: Subscription = {from: this.name, to: partner.name};
                const ss: Subscription[] =  Array();
                ss.push(s);
                sr.insert(ss);
                */
            }
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
                        name: 'roster name', // TODO
                        subscription: 'both', // TODO
                        groups: ['group'], // TODO
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

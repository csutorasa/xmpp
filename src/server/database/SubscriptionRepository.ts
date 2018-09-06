import { Cursor, DeleteWriteOpResultObject, FilterQuery, InsertWriteOpResult } from 'mongodb';
import { Repository } from './Repository';

export interface Subscription {
    from: string;
    to: string;
}

export class SubscriptionRepository extends Repository {

    public static readonly COLLECTION: string = 'subscriptions';

    public insert(data: Subscription[]): Promise<InsertWriteOpResult> {
        return this.connect().then((db) => {
            return db.collection(SubscriptionRepository.COLLECTION).insertMany(data);
        });
    }

    public query(from: string, to: string): Promise<Cursor<Subscription>> {
        return this.connect().then((db) => {
            const filter: FilterQuery<Subscription> = {
                from,
                to,
            };
            return db.collection(SubscriptionRepository.COLLECTION).find(filter);
        });
    }

    public delete(from: string, to: string): Promise<DeleteWriteOpResultObject> {
        return this.connect().then((db) => {
            const filter: FilterQuery<Subscription> = {
                from,
                to,
            };
            return db.collection(SubscriptionRepository.COLLECTION).deleteMany(filter);
        });
    }
}

import { Cursor, DeleteWriteOpResultObject, FilterQuery, InsertWriteOpResult } from 'mongodb';
import { Repository } from './Repository';

export class User {
    public name1: string;
    public email1: string;

    constructor(name: string, email: string) {
        this.name1 = name;
        this.email1 = email;
    }
}

export class UserRepository extends Repository {

    public static readonly COLLECTION: string = 'users';

    public insert(data: User[]): Promise<InsertWriteOpResult> {
        return this.connect().then((db) => {
            return db.collection(UserRepository.COLLECTION).insertMany(data);
        });
    }

    public queryByName(name: string): Promise<User> {
        return this.connect().then((db) => {
            return db.collection(UserRepository.COLLECTION).findOne( { name1: name });
        });
    }

    public queryByEmail(email: string): Promise<User> {
        return this.connect().then((db) => {
            return db.collection(UserRepository.COLLECTION).findOne( { email1: email });
        });
    }

    public queryAll(): Promise<Cursor<User>> {
        return this.connect().then((db) => {
            return db.collection(UserRepository.COLLECTION).find({ });
        });
    }

    public delete(name: string, email: string): Promise<DeleteWriteOpResultObject> {
        return this.connect().then((db) => {
            const filter: FilterQuery<User> = {
                name,
                email,
            };
            return db.collection(UserRepository.COLLECTION).deleteMany(filter);
        });
    }

    public deleteAll(): Promise<DeleteWriteOpResultObject> {
        return this.connect().then((db) => {
            return db.collection(UserRepository.COLLECTION).deleteMany({ });
        });
    }
}

import { Db, MongoClient } from 'mongodb';
import { ILogger, LoggerFactory } from '../../library';
import { ConfigurationManager } from '../config/ConfigurationManager';

export class Repository {

    private static readonly log: ILogger = LoggerFactory.create(Repository);
    private getDb: Promise<Db>;

    protected connect(): Promise<Db> {
        if (!this.getDb) {
            this.getDb = MongoClient.connect(ConfigurationManager.getConfiguration().db.url, {
                reconnectTries: 60,
                reconnectInterval: 1000,
            }).then((client) => {
                client.on('close', () => {
                    Repository.log.warn('Database connection is lost, TODO here!');
                    this.getDb = null;
                });
                return client.db(ConfigurationManager.getConfiguration().db.dbname);
            });
        }
        return this.getDb;
    }

}

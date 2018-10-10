import { Client, createClient, SearchOptions } from 'ldapjs';
import { ILogger, LoggerFactory} from '../../library';
import { User, UserRepository} from '../database/UserRepository';

export class Ldap {

    private static readonly log: ILogger = LoggerFactory.create(Ldap);

    protected client: Client;
    protected sp: SearchOptions;

    public connect(host: string, port: number = 7898): Promise<any> {
        this.client = createClient({
            url : 'ldap://' + host + ':' + port,
        });

        const promise = new Promise((resolve, reject) => {
            this.client.bind('cn=Manager,dc=maxcrc,dc=com', 'secret', function(err) {
                if (err) {
                    Ldap.log.error(err + '');
                    Ldap.log.error('Could not connect to the given address: ldap://' + host + ':' + port);
                    reject(err);
                } else {
                    Ldap.log.info('Connected to ldap server.');
                    resolve();
                }
            });
        });
        return promise;
    }

    public authenticate(user: string, pw: string): Promise<any> {
        this.sp = {
            filter: '(&(uid=' + user + ')(userPassword=' + pw.trim() + '))',
            scope: 'sub',
        };
        const promise = new Promise((resolve, reject) => {
            this.client.search('ou=people,dc=maxcrc,dc=com', this.sp, (err, res) => {
                Ldap.log.info('Try to connect with: ---' + user + '---/---' + pw.trim() + '---');

                let isEnded = false;

                if (err) {
                    Ldap.log.error('Ooops something went wrong with the Ldap search. Error msg: ' + err);
                    if (!isEnded) {
                        reject(false);
                        isEnded = true;
                    }
                } else {
                    res.on('searchEntry', function(entry) {
                        Ldap.log.info('entry: ' + JSON.stringify(entry.object));
                        if (!isEnded) {
                            resolve(true);
                            isEnded = true;
                        }
                      });
                    res.on('searchReference', function(referral) {
                        Ldap.log.info('referral: ' + referral.uris.join());
                      });
                    res.on('error', function(err) {
                        Ldap.log.info('error: ' + err.message);
                      });
                    res.on('end', function(result) {
                        Ldap.log.info('status: ' + result.status);
                        if (!isEnded) {
                            resolve(false);
                            isEnded = true;
                        }
                      });
                    Ldap.log.info('Found result in LDAP: ' + JSON.stringify(res));
                }
            });
        });

        return promise;
    }

    public async syncronize(): Promise<any> {
        const ur = new UserRepository();
        let users: User[];

        await ur.deleteAll().then((res) => {Ldap.log.info(JSON.stringify(res)); }).catch((err) => {Ldap.log.error(err); });

        await this.getUsers().then((res) => {
            // Ldap.log.info('entry: ' + JSON.stringify(res));
            users = res;
        }).catch((err) => {Ldap.log.error(err.message); });

        await ur.insert(users).then((res) => {Ldap.log.info(JSON.stringify(res)); }).catch((err) => {Ldap.log.error(err); });

        // example query
        // await ur.queryByName('ccc').then((res) => {Ldap.log.info(JSON.stringify(res)); }).catch((err) => {Ldap.log.error(err); });
        // example query to list all
        // await ur.queryAll().then( async (res) => { await res.toArray().then((data) => {Ldap.log.info(JSON.stringify(data)); }); }).catch((err) => {Ldap.log.error(err); });
        // Ldap.log.info(JSON.stringify(users.toArray()));
    }

    public async sync(): Promise<any> {
        return this.connect('NB266', 389)
                .then((res) => this.syncronize())
                    .then((res) => { Ldap.log.info('Synchronized with LDAP.'); })
                .catch((err) => {
                    Ldap.log.error(err.message); });
    }

    public getUsers(): Promise<any> {
        const users: User[] = new Array();

        this.sp = {
            scope: 'sub',
        };
        return  new Promise((resolve, reject) => {
            this.client.search('ou=people,dc=maxcrc,dc=com', this.sp, (err, res) => {

                if (err) {
                    Ldap.log.error('Ooops something went wrong with the Ldap sync. Error msg: ' + err);
                    reject(err);
                } else {
                    res.on('searchEntry', function(entry) {
                        const entryStr = JSON.stringify(entry.object);
                        let uid: string;
                        let email: string;
                        for (const key in entry.object) {
                            if (key === 'uid') {
                                uid = entry.object[key];
                            }
                            if (key === 'mail') {
                                email = entry.object[key][0];
                            }
                        }
                        if (uid != null) {
                            const user: User = {name1 : uid, email1 : email};
                            users.push(user);
                        }
                      });
                    res.on('searchReference', function(referral) {
                        Ldap.log.info('referral: ' + referral.uris.join());
                      });
                    res.on('error', function(err) {
                        Ldap.log.info('error: ' + err.message);
                      });
                    res.on('end', function(result) {
                        Ldap.log.info('status: ' + result.status);
                        resolve(users);
                      });
                    Ldap.log.info('Found result in LDAP: ' + JSON.stringify(res));
                }
            });
        });
    }

}

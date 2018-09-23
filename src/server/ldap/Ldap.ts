import { Client, createClient, SearchOptions } from 'ldapjs';
import { ILogger, LoggerFactory} from '../../library';

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
                    Ldap.log.error('Ooops Soemthing went wrong with the Ldap search. Error msg: ' + err);
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

}

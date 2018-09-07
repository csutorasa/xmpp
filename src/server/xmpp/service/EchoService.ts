import { ILogger, LoggerFactory, XML } from '../../../library';
import { JID } from '../../../library/util/jid';
import { ClientContext, ClientState } from '../context/ClientContext';

export class EchoService {

    public static getClientContext(jid: string): ClientContext {
        if (!this.context) {
            const c: ClientContext = {
                jid: JID.parse(jid),
                close: () => { this.log.info('ClientContext for EchoService cannot be closed.'); },
                state: ClientState.Connected,
                writeString: (res: string) => { this.write(res); },
                writeXML: (res: XML) => { this.writeXML(res); },
            };
            this.context = c;
        }
        return this.context;
    }

    private static readonly log: ILogger = LoggerFactory.create(EchoService);

    private static context: ClientContext;

    private static write(res: string) {
        this.log.info('Write: ' + res);
        // TODO
    }

    private static writeXML(res: XML) {
        this.log.info('Write: ' + JSON.stringify(res));
        // TODO
    }

}

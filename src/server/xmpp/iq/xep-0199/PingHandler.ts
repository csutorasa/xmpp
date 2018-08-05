import { IqRequestType, Ping, XML } from '../../../../library';
import { ClientContext } from '../../context/ClientContext';
import { ServerContext } from '../../context/ServerContext';
import { Handler } from '../../handler/Handler';

export class PingHandler extends Handler {

    protected ping = new Ping();

    public isIqSupported(server: ServerContext, client: ClientContext, type: IqRequestType, reader: XML): boolean {
        return this.ping.isRequest(reader);
    }

    public handleIq(server: ServerContext, client: ClientContext, reader: XML): void {
        const request = this.ping.readRequest(reader);

        client.writeXML(this.ping.createResponse({
            id: request.id,
            from: server.hostname,
            to: client.jid.stringify(),
        }));
    }
}

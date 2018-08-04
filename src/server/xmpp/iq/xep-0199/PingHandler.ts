import { XMLReader, IqRequestType, Ping } from "../../../../library";
import { ClientContext } from "../../context/ClientContext";
import { Handler } from "../../handler/Handler";
import { ServerContext } from "../../context/ServerContext";

export class PingHandler extends Handler {

    protected ping = new Ping();

    public isIqSupported(server: ServerContext, client: ClientContext, type: IqRequestType, reader: XMLReader): boolean {
        return this.ping.isRequest(reader);
    }

    public handleIq(server: ServerContext, client: ClientContext, reader: XMLReader): void {
        const request = this.ping.readRequest(reader);

        client.writeXML(this.ping.createResponse({
            id: request.id,
            from: server.hostname,
            to: client.jid.stringify(),
        }));
    }
}

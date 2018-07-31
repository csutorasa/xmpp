import { XMLReader, Session } from "../../../library";
import { ClientContext } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class SessionHandler extends Handler {
    protected session = new Session();

    public isSupported(server: ServerContext, client: ClientContext, reader: XMLReader): boolean {
        return this.session.isRequest(reader);
    }

    public handle(server: ServerContext, client: ClientContext, reader: XMLReader): void {
        const request = this.session.readRequest(reader);
        client.writeXML(this.session.createResponse({
            id: request.id,
            host: server.hostname
        }));
    }
}
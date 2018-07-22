import { XMLReader } from "../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { ServerContext } from "../context/ServerContext";

export abstract class Handler {

    public init(context: ServerContext): void {

    }

    public isSupportedRaw(server: ServerContext, client: ClientContext, request: string): boolean {
        if (client.state === ClientState.Connected) {
            return this.isSupported(server, client, XMLReader.fromXML(request));
        }
        return false;
    }

    public isSupported(server: ServerContext, client: ClientContext, request: XMLReader): boolean {
        return false;
    }

    public handleRaw(server: ServerContext, client: ClientContext, request: string): void {
        return this.handle(server, client, XMLReader.fromXML(request));
    }

    public handle(server: ServerContext, client: ClientContext, request: XMLReader): void {

    }
}
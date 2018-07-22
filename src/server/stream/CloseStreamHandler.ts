import { XMLStream, XMLReader } from "../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class CloseStreamHandler extends Handler {
    protected xmlStream = new XMLStream();

    public isSupportedRaw(server: ServerContext, client: ClientContext, request: string): boolean {
        return client.state !== ClientState.Connected && request === this.xmlStream.createCloseStreamMessage();
    }

    public handleRaw(server: ServerContext, client: ClientContext, request: string): void {
        client.state = ClientState.Disconnected;
    }
}
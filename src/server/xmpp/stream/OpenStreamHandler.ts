import { Stream, XMLEvent, XMLEventHelper, Features } from "../../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class OpenStreamHandler extends Handler {
    protected stream = new Stream();
    protected features = new Features();

    public isSingleSupported(server: ServerContext, client: ClientContext, event: XMLEvent): boolean {
        return (client.state === ClientState.Connecting || client.state === ClientState.Authenticated) && this.stream.isOpenStreamMessage(event);
    }

    public handleSingle(server: ServerContext, client: ClientContext, event: XMLEvent): void {
        const request = this.stream.readOpenStreamMessage(event);
        const openStream = this.stream.createOpenStreamMessage({
            from: server.hostname,
            to: request.from,
        });
        if(client.state === ClientState.Connecting) {
            client.writeString(openStream);
            client.writeXML(this.features.createFeaturesMessage({
                features: [ server.authfeatures ]
            }));
            client.state = ClientState.Connected;
        } else if(client.state === ClientState.Authenticated) {
            client.writeString(openStream);
            client.writeXML(this.features.createFeaturesMessage({
                features: [ server.features ]
            }));
        }
    }
}
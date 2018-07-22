import { XMLStream, XMLWriter, XMLReader } from "../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class OpenStreamHandler extends Handler {
    protected xmlStream = new XMLStream();

    public isSupportedRaw(server: ServerContext, client: ClientContext, request: string): boolean {
        if(client.state !== ClientState.Connecting && client.state !== ClientState.Authenticated) {
            return false;
        }
        const xml = XMLReader.fromOpenXML(request);
        const stream = xml.getElement('stream:stream')
        return stream != null && stream.getAttr('to') === server.hostname;
    }

    public handleRaw(server: ServerContext, client: ClientContext, request: string): void {
        const xml = XMLReader.fromOpenXML(request);
        const openStream = this.xmlStream.createOpenStreamMessage(server.hostname, xml.getElement('stream:stream').getAttr('from'));
        client.writeRaw(openStream);
        if(client.state === ClientState.Connecting) {
            client.write(this.xmlStream.createFeaturesMessage(server.features, server.authfeatures));
            client.state = ClientState.Connected;
        } else {
            client.write(this.xmlStream.createFeaturesMessage(server.features));
        }
    }
}
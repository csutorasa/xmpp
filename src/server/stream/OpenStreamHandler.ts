import { XMLStream, XMLWriter, XMLReader } from "../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class OpenStreamHandler extends Handler {
    protected xmlStream = new XMLStream();

    public isSupportedRaw(server: ServerContext, client: ClientContext, request: string): boolean {
        if(client.state !== ClientState.Connecting) {
            return false;
        }
        const xml = XMLReader.fromOpenXML(request);
        const stream = xml.getElement('stream:stream')
        return stream != null && stream.getAttr('to') === server.hostname;
    }

    public handleRaw(server: ServerContext, client: ClientContext, request: string): void {
        const xml = XMLReader.fromOpenXML(request);
        const openStream = this.xmlStream.createOpenStreamMessage(server.hostname, xml.getElement('stream:stream').getAttr('from'), '++TR84Sm6A3hnt3Q065SnAbbk3Y=');
        client.state = ClientState.Connected;
        client.writeRaw(openStream);
        client.write(this.xmlStream.createFeaturesMessage());
    }
}
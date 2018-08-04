import { ClientContext } from "../context/ClientContext";
import { ServerContext } from "../context/ServerContext";
import { XMLEvent, XML, IqRequestType } from "../../../library";

export abstract class Handler {

    public init(context: ServerContext): void {

    }

    public isSingleSupported(server: ServerContext, client: ClientContext, event: XMLEvent): boolean {
        return false;
    }

    public isIqSupported(server: ServerContext, client: ClientContext, type: IqRequestType, reader: XML): boolean {
        return false;
    }

    public isSupported(server: ServerContext, client: ClientContext, reader: XML): boolean {
        return false;
    }

    public handleSingle(server: ServerContext, client: ClientContext, event: XMLEvent): void {

    }

    public handleIq(server: ServerContext, client: ClientContext, reader: XML): void {
        
    }

    public handle(server: ServerContext, client: ClientContext, reader: XML): void {

    }
}
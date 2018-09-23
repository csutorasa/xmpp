import { IqRequestType, XML, XMLEvent } from '../../../library';
import { ClientContext } from '../context/ClientContext';
import { ServerContext } from '../context/ServerContext';

export abstract class Handler {

    public init(context: ServerContext): void {
        // Unused
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

    public handleSingle(server: ServerContext, client: ClientContext, event: XMLEvent): Promise<any> {
        return Promise.reject();
    }

    public handleIq(server: ServerContext, client: ClientContext, reader: XML): Promise<any> {
        return Promise.reject();
    }

    public handle(server: ServerContext, client: ClientContext, reader: XML): Promise<any> {
        return Promise.reject();
    }
}

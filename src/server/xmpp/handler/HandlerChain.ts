import { Handler } from "./Handler";
import { ClientContext } from "../context/ClientContext";
import { ServerContext } from "../context/ServerContext";
import { XMLEvent } from "../../../library";

export class HandlerChain {

    protected readonly handlers: Handler[] = [];

    public register(handler: Handler): HandlerChain {
        this.handlers.push(handler);
        return this;
    }

    public deregister(handler: Handler): void {
        this.handlers.splice(this.handlers.indexOf(handler), 1);
    }

    public execute(server: ServerContext, client: ClientContext, events: XMLEvent[]): void {
        const supported = this.handlers.filter(h => this.isSupported(h, server, client, events));
        if(supported.length > 1) {
            throw new Error('Ambigous handlers found!');
        }
        if(supported.length === 1) {
            supported[0].handle(server, client, events);
            this.execute(server, client, events);
        }
    }

    protected isSupported(handler: Handler, server: ServerContext, client: ClientContext, events: XMLEvent[]): boolean {
        try {
            return handler.isSupported(server, client, events);
        } catch {
            return false;
        }
    }
}
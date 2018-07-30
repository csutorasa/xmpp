import { Handler } from "./Handler";
import { ClientContext } from "../context/ClientContext";
import { ServerContext } from "../context/ServerContext";
import { XMLEvent, XMLEventType, XMLEventHelper, XMLReader } from "../../../library";

export class HandlerChain {

    protected readonly handlers: Handler[] = [];

    public constructor() {
        //XMLEventType
    }

    public register(handler: Handler): HandlerChain {
        this.handlers.push(handler);
        return this;
    }

    public deregister(handler: Handler): void {
        this.handlers.splice(this.handlers.indexOf(handler), 1);
    }

    public execute(server: ServerContext, client: ClientContext, events: XMLEvent[]): void {
        if (events.length > 0) {
            const singleSupported = this.handlers.filter(h => this.isSingleSupported(h, server, client, events[0]));
            if (singleSupported.length > 0) {
                const event: XMLEvent = XMLEventHelper.processFirst(events);
                singleSupported.forEach(h => h.handleSingle(server, client, event));
            } else {
                const reader: XMLReader = XMLEventHelper.getTag(events);
                if (reader) {
                    const supported = this.handlers.filter(h => this.isSupported(h, server, client, reader));
                    if (supported.length > 0) {
                        XMLEventHelper.processTag(events);
                        supported.forEach(h => h.handle(server, client, reader));
                    }
                }
            }
        }
    }

    protected isSingleSupported(handler: Handler, server: ServerContext, client: ClientContext, event: XMLEvent): boolean {
        try {
            return handler.isSingleSupported(server, client, event);
        } catch {
            return false;
        }
    }

    protected isSupported(handler: Handler, server: ServerContext, client: ClientContext, reader: XMLReader): boolean {
        try {
            return handler.isSupported(server, client, reader);
        } catch {
            return false;
        }
    }
}
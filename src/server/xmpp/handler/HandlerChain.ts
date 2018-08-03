import { Handler } from "./Handler";
import { ClientContext } from "../context/ClientContext";
import { ServerContext } from "../context/ServerContext";
import { XMLEvent, XMLEventHelper, XMLReader, IqRequestType } from "../../../library";

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
                    if (this.isIq(reader)) {
                        const iqSupported = this.handlers.filter(h => this.isIqSupported(h, server, client, reader));
                        if (iqSupported.length > 0) {
                            XMLEventHelper.processTag(events);
                            iqSupported.forEach(h => h.handleIq(server, client, reader));
                        } else {
                            // TODO
                        }
                    } else {
                        const supported = this.handlers.filter(h => this.isSupported(h, server, client, reader));
                        if (supported.length > 0) {
                            XMLEventHelper.processTag(events);
                            supported.forEach(h => h.handle(server, client, reader));
                        }
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

    protected isIq(reader: XMLReader): boolean {
        const iq = reader.getElement('iq');
        return iq != null && (iq.getAttr('type') == 'set' || iq.getAttr('type') === 'get');
    }

    protected isIqSupported(handler: Handler, server: ServerContext, client: ClientContext, reader: XMLReader): boolean {
        try {
            return handler.isIqSupported(server, client, <IqRequestType>reader.getElement('iq').getAttr('type'), reader);
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
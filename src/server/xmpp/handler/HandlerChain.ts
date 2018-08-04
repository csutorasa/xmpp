import { Handler } from "./Handler";
import { ClientContext } from "../context/ClientContext";
import { ServerContext } from "../context/ServerContext";
import { XMLEvent, XMLEventHelper, XML, IqRequestType, ErrorStanza, Logger, LoggerFactory } from "../../../library";

export class HandlerChain {

    protected readonly handlers: Handler[] = [];
    private static readonly log: Logger = LoggerFactory.create(HandlerChain);

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
                const reader: XML = XMLEventHelper.getTag(events);
                if (reader) {
                    if (this.isIq(reader)) {
                        const iqSupported = this.handlers.filter(h => this.isIqSupported(h, server, client, reader));
                        XMLEventHelper.processTag(events);
                        if (iqSupported.length > 0) {
                            HandlerChain.log.info(() => 'Processed ' + reader.toReadableString());
                            iqSupported.forEach(h => h.handleIq(server, client, reader));
                        } else {
                            HandlerChain.log.warn(() => 'Unprocessable ' + reader.toReadableString());
                            client.writeXML(XML.create('iq')
                                .attr('type', 'error')
                                .attr('from', server.hostname)
                                .attr('to', client.jid.stringify())
                                .attr('id', reader.getAttr('id'))
                                .element(
                                    ErrorStanza.internalServerError()
                                )
                            )
                        }
                    } else {
                        const supported = this.handlers.filter(h => this.isSupported(h, server, client, reader));
                        XMLEventHelper.processTag(events);
                        if (supported.length > 0) {
                            HandlerChain.log.info(() => 'Processed ' + reader.toReadableString());
                            supported.forEach(h => h.handle(server, client, reader));
                        } else {
                            HandlerChain.log.warn(() => 'Unprocessable ' + reader.toReadableString());
                        }
                    }
                }
            }
        }
    }

    protected isSingleSupported(handler: Handler, server: ServerContext, client: ClientContext, event: XMLEvent): boolean {
        try {
            return handler.isSingleSupported(server, client, event);
        } catch(e) {
            HandlerChain.log.error(e.message || e);
            return false;
        }
    }

    protected isIq(reader: XML): boolean {
        return reader.getName() === 'iq' && (reader.getAttr('type') == 'set' || reader.getAttr('type') === 'get');
    }

    protected isIqSupported(handler: Handler, server: ServerContext, client: ClientContext, reader: XML): boolean {
        try {
            return handler.isIqSupported(server, client, <IqRequestType>reader.getAttr('type'), reader);
        } catch(e) {
            HandlerChain.log.error(e.message || e);
            return false;
        }
    }

    protected isSupported(handler: Handler, server: ServerContext, client: ClientContext, reader: XML): boolean {
        try {
            return handler.isSupported(server, client, reader);
        } catch(e) {
            HandlerChain.log.error(e.message || e);
            return false;
        }
    }
}
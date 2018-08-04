import { AbstractServer } from "./AbstractServer";
import { ServerContext } from "../context/ServerContext";
import { ClientContext } from "../context/ClientContext";
import { HandlerChain } from "../handler/HandlerChain";
import { Handler } from "../handler/Handler";
import { XML, XMLEvent, Logger, LoggerFactory } from "../../../library";

export class XMPPServer extends AbstractServer {

    protected readonly servers: AbstractServer[] = [];
    protected readonly context: ServerContext = {};

    protected readonly handlerChain = new HandlerChain();
    private static readonly log: Logger = LoggerFactory.create(XMPPServer);

    public constructor() {
        super();
        this.context.hostname = 'localhost';
        this.context.sessionFeatures = XML.create('stream:features');
        this.context.authFeatures = XML.create('stream:features');
    }

    public registerServer(server: AbstractServer): XMPPServer {
        this.servers.push(server);
        server.inputHandler = (context, data) => { this.onData(context, data); };
        server.inputXMLHandler = (context, events) => { this.onXML(context, events); };
        server.outputHandler = (context, data, promise) => { this.onWrite(context, data, promise); };
        return this;
    }

    public addHandler(handler: Handler): XMPPServer {
        handler.init(this.context);
        this.handlerChain.register(handler);
        return this;
    }

    public removeHandler(handler: Handler): void {
        this.handlerChain.deregister(handler);
    }

    protected onData(context: ClientContext, data: string): void {
        XMPPServer.log.debug('<<< RawInput:' + data);
    }

    protected onXML(context: ClientContext, events: XMLEvent[]): void {
        this.handlerChain.execute(this.context, context, events);
    }

    protected onWrite(context: ClientContext, data: string, promise: Promise<any>): void {
        promise.then(() => {
            XMPPServer.log.debug('>>> RawOutput:' + data);
        }, err => {
            XMPPServer.log.warn('>>> Output failed:' + err);
        })
    }

    public start(): Promise<any> {
        return Promise.all(this.servers.map(s => s.start()));
    }

    public stop(): Promise<any> {
        return Promise.all(this.servers.map(s => s.stop()));
    }
}
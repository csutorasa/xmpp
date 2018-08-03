import { AbstractServer } from "./AbstractServer";
import { ServerContext } from "../context/ServerContext";
import { ClientContext } from "../context/ClientContext";
import { HandlerChain } from "../handler/HandlerChain";
import { Handler } from "../handler/Handler";
import { XMLWriter, XMLEvent } from "../../../library";

export class XMPPServer extends AbstractServer {

    protected readonly servers: AbstractServer[] = [];
    protected readonly context: ServerContext = {};
    
    protected readonly handlerChain = new HandlerChain();

    public constructor() {
        super();
        this.context.hostname = 'arminpc';
        this.context.features = XMLWriter.create('stream:features');
        this.context.authfeatures = XMLWriter.create('stream:features');
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
        console.log('<<< RawInput:', data);
    }

    protected onXML(context: ClientContext, events: XMLEvent[]): void {
        // console.log('<<< XMLInput:', events[events.length - 1]);
        this.handlerChain.execute(this.context, context, events);
    }

    protected onWrite(context: ClientContext, data: string, promise: Promise<any>): void {
        promise.then(() => {
            console.log('>>> RawOutput:', data);
        }, err => {
            console.error('>>> Output failed:', err);
        })
    } 

    public start(): Promise<any> {
        return Promise.all(this.servers.map(s => s.start()));
    }

    public stop(): Promise<any> {
        return Promise.all(this.servers.map(s => s.stop()));
    }
}
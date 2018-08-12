import { DiscoveryInfo, DiscoveryItems, ILogger, LoggerFactory, XML, XMLEvent } from '../../../library';
import { ClientContext } from '../context/ClientContext';
import { ServerContext } from '../context/ServerContext';
import { Handler } from '../handler/Handler';
import { HandlerChain } from '../handler/HandlerChain';
import { AbstractServer } from './AbstractServer';

export class XMPPServer extends AbstractServer {
    private static readonly log: ILogger = LoggerFactory.create(XMPPServer);

    protected readonly servers: AbstractServer[] = [];
    protected readonly context: ServerContext = {};

    protected readonly handlerChain = new HandlerChain();

    public constructor() {
        super();
        this.context.hostname = 'localhost';
        this.context.sessionFeatures = XML.create('stream:features');
        this.context.authFeatures = XML.create('stream:features');
        this.context.discoveryInfo = XML.create('query').xmlns('', DiscoveryInfo.DISCOVERYINFO_XMLNS);
        this.context.discoveryItems = XML.create('query').xmlns('', DiscoveryItems.DISCOVERYITEMS_XMLNS);
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

    public start(): Promise<any> {
        return Promise.all(this.servers.map((s) => s.start())).then(() => {
            XMPPServer.log.info('Server started');
        });
    }

    public stop(): Promise<any> {
        return Promise.all(this.servers.map((s) => s.stop()));
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
        }, (err) => {
            XMPPServer.log.warn('>>> Output failed:' + err);
        });
    }
}

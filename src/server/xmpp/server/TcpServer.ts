import * as net from 'net';
import { ILogger, LoggerFactory, XML, XMLStreamReader } from '../../../library';
import { ClientContext, ClientState } from '../context/ClientContext';
import { AbstractServer } from './AbstractServer';

export class TcpServer extends AbstractServer {
    private static readonly log: ILogger = LoggerFactory.create(TcpServer);

    protected server: net.Server;

    public constructor(protected port: number = 5222) {
        super();
        this.server = net.createServer((socket) => this.onNewClient(socket));
    }

    public start(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.server.listen(this.port, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public stop(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.server.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    protected onNewClient(socket: net.Socket) {
        const context: ClientContext = {
            close: () => this.closeClient(socket),
            state: ClientState.Connecting,
            writeString: (res: string) => { this.write(socket, context, res); },
            writeXML: (res: XML) => { this.writeXML(socket, context, res); },
        };
        socket.setEncoding('utf8');
        const stream = new XMLStreamReader();
        stream.on(() => {
            if (this.inputXMLHandler) {
                this.inputXMLHandler(context, stream.getContent());
            }
        });
        socket.on('data', (data) => {
            const str = data.toString().replace(/'/g, '"');
            if (this.inputHandler) {
                this.inputHandler(context, str);
            }
            stream.append(str);
        });
        socket.on('error', (err) => {
            if (err.message.match(/ECONNRESET/)) {
                context.state = ClientState.Disconnected;
            } else {
                TcpServer.log.error(err.message);
            }
        });
        socket.on('end', (err) => {
            context.state = ClientState.Disconnected;
        });
    }

    protected writeXML(socket: net.Socket, context: ClientContext, data: XML): Promise<any> {
        TcpServer.log.info(() => 'Sent ' + data.toReadableString() + ' to ' + context.jid.stringify());
        return this.write(socket, context, data.toXML());
    }

    protected write(socket: net.Socket, context: ClientContext, data: string): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            socket.write(data, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        if (this.outputHandler) {
            this.outputHandler(context, data, promise);
        }
        return promise;
    }
}

import * as net from 'net';
import { AbstractServer } from './AbstractServer';
import { XMLWriter } from '../../library';
import { ClientContext, ClientState } from '../context/ClientContext';

export class TcpServer extends AbstractServer {

    protected server: net.Server;

    public constructor(protected port: number = 5222) {
        super();
        this.server = net.createServer((socket) => this.onNewClient(socket));
    }

    public start(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.server.listen(this.port, err => {
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
            this.server.close(err => {
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
            state: ClientState.Connecting,
            write: (res: XMLWriter) => { this.write(socket, context, res.toXML()); },
            writeRaw: (res: string) => { this.write(socket, context, res); },
            close: () => this.closeClient(socket),
        };
        //socket.setEncoding('utf8')
        socket.on('data', data => {
            if (this.inputHandler) {
                this.inputHandler(context, data.toString());
            }
        });
        socket.on('error', err => {
            if (err.message.match(/ECONNRESET/)) {
                context.state = ClientState.Disconnected;
            } else {
                console.log(err.message);
            }
        });
        socket.on('end', err => {
            context.state = ClientState.Disconnected;
        });
    }

    protected write(socket: net.Socket, context: ClientContext, data: string): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            socket.write(data, err => {
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
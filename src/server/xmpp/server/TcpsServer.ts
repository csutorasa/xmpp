import * as net from 'net';
import * as tls from 'tls';
import { TcpServer } from './TcpServer';

export class TcpsServer extends TcpServer {

    protected server: net.Server;

    public constructor(port: number = 5223) {
        super(port);
        this.server = tls.createServer({
            
        }, (socket) => this.onNewClient(socket));
    }
}
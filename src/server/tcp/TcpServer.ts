import * as net from 'net';
import { Server } from '../Server';
import { HandlerContext, XMLHelper } from '../../library';

export class TcpServer extends Server {
    
    protected server: net.Server;

    public start(port: number = 5222): void {
        this.server = net.createServer((socket) => {
            const context: HandlerContext = {
                write: (res) => { socket.write(new XMLHelper().toXML(res), 'utf-8'); console.log(new XMLHelper().toXML(res)); },
                writeRaw: (res) => { socket.write(res, 'utf-8'); console.log(res); },
            };
            socket.pipe(socket);
            socket.on('data', data => {
                this.onData(context, data.toString());
            });
        });
        this.server.listen(port);
    }

    public stop(): void {
        // TODO promise
        this.server.close();
    }
}
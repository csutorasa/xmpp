import { TcpServer } from "./server/TcpServer";
import { OpenStreamHandler } from "./stream/OpenStreamHandler";
import { XMPPServer } from "./server/XMPPServer";
import { CloseStreamHandler } from "./stream/CloseStreamHandler";
import { TcpsServer } from "./server/TcpsServer";

const server = new XMPPServer()

server
    .registerServer(new TcpServer())
    .registerServer(new TcpsServer())
    .addHandler(new OpenStreamHandler())
    .addHandler(new CloseStreamHandler())

server.start().then(() => {
    console.log('Server started');
});

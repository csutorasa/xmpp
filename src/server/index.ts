import { TcpServer } from "./server/TcpServer";
import { OpenStreamHandler } from "./stream/OpenStreamHandler";
import { XMPPServer } from "./server/XMPPServer";
import { CloseStreamHandler } from "./stream/CloseStreamHandler";
import { TcpsServer } from "./server/TcpsServer";
import { NonSASLAuthenticationHandler } from "./xep/0078/NonSASLAuthenticationHandler";
import { PlainAuthHandler } from "./auth/PlainAuthHandler";
import { BindHandler } from "./stream/BindHandler";

const server = new XMPPServer()

server
    .registerServer(new TcpServer())
    //.registerServer(new TcpsServer())
    .addHandler(new OpenStreamHandler())
    .addHandler(new CloseStreamHandler())
    .addHandler(new PlainAuthHandler())
    .addHandler(new BindHandler())
    .addHandler(new NonSASLAuthenticationHandler())

server.start().then(() => {
    console.log('Server started');
});

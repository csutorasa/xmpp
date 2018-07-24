import { TcpServer } from "./server/TcpServer";
import { XMPPServer } from "./server/XMPPServer";
import { OpenStreamHandler } from "./stream/OpenStreamHandler";
import { InstructionHandler } from "./stream/InstructionHandler";
import { CloseStreamHandler } from "./stream/CloseStreamHandler";
import { NonSASLAuthenticationHandler } from "./xep/0078/NonSASLAuthenticationHandler";
import { PlainAuthHandler } from "./auth/PlainAuthHandler";
import { BindHandler } from "./stream/BindHandler";
import { SessionHandler } from "./stream/SessionHandler";

const server = new XMPPServer()

server
    .registerServer(new TcpServer())
    //.registerServer(new TcpsServer())
    .addHandler(new OpenStreamHandler())
    .addHandler(new CloseStreamHandler())
    .addHandler(new InstructionHandler())
    .addHandler(new PlainAuthHandler())
    .addHandler(new BindHandler())
    .addHandler(new SessionHandler())
    .addHandler(new NonSASLAuthenticationHandler())

server.start().then(() => {
    console.log('Server started');
});

/*import { XMLReader, XMLStreamReader } from "../library";
const reader = new XMLStreamReader();
reader.append('<test asd="dsa"></test>')
console.log(reader.getContent());*/

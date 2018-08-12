import { PlainAuthHandler } from './xmpp/auth/PlainAuthHandler';
import { BindHandler } from './xmpp/iq/BindHandler';
import { RosterHandler } from './xmpp/iq/RosterHandler';
import { SessionHandler } from './xmpp/iq/SessionHandler';
import { DiscoveryInfoHandler } from './xmpp/iq/xep-0030/DiscoveryInfoHandler';
import { DiscoveryItemsHandler } from './xmpp/iq/xep-0030/DiscoveryItemsHandler';
import { PingHandler } from './xmpp/iq/xep-0199/PingHandler';
import { TimeHandler } from './xmpp/iq/xep-0202/TimeHandler';
import { TcpServer } from './xmpp/server/TcpServer';
import { XMPPServer } from './xmpp/server/XMPPServer';
import { CloseStreamHandler } from './xmpp/stream/CloseStreamHandler';
import { InstructionHandler } from './xmpp/stream/InstructionHandler';
import { OpenStreamHandler } from './xmpp/stream/OpenStreamHandler';

const server = new XMPPServer();

server
    .registerServer(new TcpServer())
    // .registerServer(new TcpsServer())
    .addHandler(new OpenStreamHandler())
    .addHandler(new CloseStreamHandler())
    .addHandler(new InstructionHandler())
    .addHandler(new PlainAuthHandler())
    .addHandler(new BindHandler())
    .addHandler(new SessionHandler())
    .addHandler(new DiscoveryInfoHandler())
    .addHandler(new DiscoveryItemsHandler())
    .addHandler(new RosterHandler())
    .addHandler(new TimeHandler())
    .addHandler(new PingHandler());

server.start();

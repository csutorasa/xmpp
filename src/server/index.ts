import { Configuration } from './config/Configuration';
import { ConfigurationManager } from './config/ConfigurationManager';
import { PlainAuthHandler } from './xmpp/auth/PlainAuthHandler';
import { BindHandler } from './xmpp/iq/BindHandler';
import { MessageHandler } from './xmpp/iq/MessageHandler';
import { PresenceHandler } from './xmpp/iq/PresenceHandler';
import { RosterHandler } from './xmpp/iq/RosterHandler';
import { SessionHandler } from './xmpp/iq/SessionHandler';
import { VCardHandler } from './xmpp/iq/VCardHandler';
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

const config: Configuration = ConfigurationManager.getConfiguration();

server
    .registerServer(new TcpServer(config.server.tcpPort))
    // .registerServer(new TcpsServer(config.server.tcpsPort))
    .addHandler(new OpenStreamHandler())
    .addHandler(new CloseStreamHandler())
    .addHandler(new InstructionHandler())
    .addHandler(new PlainAuthHandler())
    .addHandler(new BindHandler())
    .addHandler(new SessionHandler())
    .addHandler(new DiscoveryInfoHandler())
    .addHandler(new DiscoveryItemsHandler())
    .addHandler(new RosterHandler())
    .addHandler(new VCardHandler())
    .addHandler(new PresenceHandler())
    .addHandler(new MessageHandler())
    .addHandler(new TimeHandler())
    .addHandler(new PingHandler());

server.start();

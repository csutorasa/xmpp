import { Stream, XML } from "../../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class PlainAuthHandler extends Handler {
    public init(context: ServerContext): void {
        context.authFeatures.element(XML.create('mechanisms')
            .xmlns('', Stream.MECHANISMS_XMLNS)
            .element(XML.create('mechanism').text('PLAIN'))
        )
    }

    public isSupported(server: ServerContext, client: ClientContext, reader: XML): boolean {
        return reader.getName() == 'auth' && reader.getAttr('mechanism') === 'PLAIN';
    }

    public handle(server: ServerContext, client: ClientContext, reader: XML): void {
        const buf = Buffer.from(reader.getContent(), 'base64');
        let authenticated: boolean = false;
        let user: string;
        let pw: string;
        if (buf.indexOf("\x00", 0) == 0) {
            const idx: number = buf.indexOf("\x00", 1);
            if (idx > 1) {
                const bufUser = buf.slice(1, idx);
                user = bufUser.toString();
                const bufPw = buf.slice(idx);
                pw = bufPw.toString();
                console.log('auth-user:', user);
                console.log('auth-pw:', pw);

                authenticated = this.authenticate(user, pw);
            }
        }
        else {
            console.log('auth', 'Invalid PLAIN format');
        }

        if (authenticated) {
            client.jid.name = user;
            client.state = ClientState.Authenticated;

            const success = XML.create('success').xmlns('', 'urn:ietf:params:xml:ns:xmpp-sasl');
            client.writeXML(success);
        }
        else {
            const failure = XML.create('failure')
                .xmlns('', 'urn:ietf:params:xml:ns:xmpp-sasl')
                .element(XML.create('invalid-authzid'));
            client.writeXML(failure);
            if (client.state != ClientState.Disconnected && client.state != ClientState.Disconnecting) {
                const stream: Stream = new Stream();
                const close: string = stream.createCloseStreamMessage();
                client.writeString(close);
            }
            if (client.state != ClientState.Disconnected && client.state != ClientState.Disconnecting) {
                client.close();
            }
        }
    }

    private authenticate(user: string, pw: string): boolean {
        return pw.localeCompare('password') == 0;
    }
}
import { Stream, XMLWriter, XMLReader } from "../../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class PlainAuthHandler extends Handler {
    public init(context: ServerContext): void {
        context.authfeatures.element(XMLWriter.create('mechanisms')
            .xmlns('', Stream.MECHANISMS_XMLNS)
            .element(XMLWriter.create('mechanism').text('PLAIN'))
        )
    }

    public isSupported(server: ServerContext, client: ClientContext, reader: XMLReader): boolean {
        const tag = reader.getElement('auth');
        return tag != null && tag.getAttr('mechanism') === 'PLAIN';
    }

    public handle(server: ServerContext, client: ClientContext, reader: XMLReader): void {
        const auth = reader.getElement('auth');
        console.log('auth', auth.getContent());
        var buf = Buffer.from(auth.getContent(), 'base64');
        var authenticated: boolean = false;
        if (buf.indexOf("\x00", 0) == 0) {
            var idx: number = buf.indexOf("\x00", 1);
            if (idx > 1) {
                var bufUser = buf.slice(1, idx);
                var user: string = bufUser.toString();
                var bufPw = buf.slice(idx);
                var pw: string = bufPw.toString();
                console.log('auth-user:', user);
                console.log('auth-pw:', pw);

                authenticated = this.authenticate(user, pw);
            }
        }
        else {
            console.log('auth', 'Invalid PLAIN format');
        }

        if (authenticated) {
            client.username = user;
            client.state = ClientState.Authenticated;

            const success = XMLWriter.create('success').xmlns('', 'urn:ietf:params:xml:ns:xmpp-sasl');
            client.writeXML(success);
        }
        else {
            const failure = XMLWriter.create('failure')
                .xmlns('', 'urn:ietf:params:xml:ns:xmpp-sasl')
                .element(XMLWriter.create('invalid-authzid'));
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
        return pw.localeCompare("password") == 0;
    }
}
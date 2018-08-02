import { Stream, XMLWriter, XMLReader } from "../../../library";
import { ClientContext, ClientState } from "../context/ClientContext";
import { Handler } from "../handler/Handler";
import { ServerContext } from "../context/ServerContext";


export class PlainAuthHandler extends Handler {
    public init(context: ServerContext): void {
        context.authfeatures.element('mechanisms', XMLWriter.create().xmlns('', Stream.MECHANISMS_XMLNS)
            .element('mechanism', XMLWriter.create().text('PLAIN'))
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
        if(buf.indexOf("\x00",0) == 0)
        {
            var idx: number = buf.indexOf("\x00",1);
            if(idx > 1)
            {
                var bufUser = buf.slice(1, idx);
                var user: string = bufUser.toString();
                client.username = user;
                console.log('auth-user:', user);
                var bufPw = buf.slice(idx);
                var pw: string = bufPw.toString();
                console.log('auth-pw:', pw);
                if(pw.localeCompare("password") == 0)
                {
                    client.state = ClientState.Authenticated;
                }
            }
        }
        else{
            console.log('auth', 'Invalid PLAIN format');
        }
        
        const success = XMLWriter.create().element('success', XMLWriter.create().xmlns('', 'urn:ietf:params:xml:ns:xmpp-sasl'));
        client.writeXML(success);
    }
}
import { XMLStream, XMLWriter, XMLEvent, XMLReader } from "../../../../library";
import { ClientContext } from "../../context/ClientContext";
import { Handler } from "../../handler/Handler";
import { ServerContext } from "../../context/ServerContext";


export class NonSASLAuthenticationHandler extends Handler {
    protected xmlStream = new XMLStream();

    public init(context: ServerContext): void {
        context.authfeatures.element('auth', XMLWriter.create().xmlns('', 'http://jabber.org/features/iq-auth'));
    }
}
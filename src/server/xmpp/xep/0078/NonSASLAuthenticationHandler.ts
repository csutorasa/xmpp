import { XMLWriter } from "../../../../library";
import { Handler } from "../../handler/Handler";
import { ServerContext } from "../../context/ServerContext";


export class NonSASLAuthenticationHandler extends Handler {

    public init(context: ServerContext): void {
        context.authfeatures.element('auth', XMLWriter.create().xmlns('', 'http://jabber.org/features/iq-auth'));
    }
}
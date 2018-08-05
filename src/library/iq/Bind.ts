import { JID } from '../util/jid';
import { XML } from '../xml/XML';
import { IqBase, IqRequest, IqResponse } from './IqBase';

export interface BindRequest extends IqRequest {
    resource?: string;
}

export interface BindResponse extends IqResponse {
    jid: JID;
}

export class Bind extends IqBase {

    public static readonly BIND_XMLNS = 'urn:ietf:params:xml:ns:xmpp-bind';

    public createResponse(response: BindResponse): XML {
        return this.createIq(response.id, 'result')
            .element(XML.create('bind')
                .xmlns('', Bind.BIND_XMLNS)
                .element(XML.create('jid').text(response.jid.stringify())),
            );
    }

    public isRequest(request: XML): boolean {
        return this.isIq(request, 'set', 'bind', Bind.BIND_XMLNS);
    }

    public readRequest(request: XML): BindRequest {
        const bind = request.getElement('bind');
        const resource = bind.getElement('resource') != null ? bind.getElement('resource').getContent() : null;
        return {
            id: this.readId(request),
            resource,
        };
    }
}

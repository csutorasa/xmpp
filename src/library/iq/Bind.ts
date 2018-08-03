import { XMLWriter } from '../xml/XMLWriter';
import { XMLReader } from '../xml/XMLReader';
import { JID } from '../util/jid';
import { IqRequest, IqResponse, IqBase } from './IqBase';

export interface BindRequest extends IqRequest {
    resource?: string;
}

export interface BindResponse extends IqResponse {
    jid: JID;
}

export class Bind extends IqBase {

    public static readonly BIND_XMLNS = 'urn:ietf:params:xml:ns:xmpp-bind';

    public createResponse(response: BindResponse): XMLWriter {
        return this.createIq(response.id, 'result')
            .element(XMLWriter.create('bind')
                .xmlns('', Bind.BIND_XMLNS)
                .element(XMLWriter.create('jid').text(response.jid.stringify()))
            )
    }

    public isRequest(request: XMLReader): boolean {
        return this.isIq(request, 'set', 'bind', Bind.BIND_XMLNS);
    }

    public readRequest(request: XMLReader): BindRequest {
        const bind = this.readData(request, 'bind');
        const resource = bind.getElement('resource') != null ? bind.getElement('resource').getContent() : null;
        return {
            id: this.readId(request),
            resource: resource,
        }; 
    }
}

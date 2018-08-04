import { XMLWriter } from '../xml/XMLWriter';
import { XMLReader } from '../xml/XMLReader';
import { IqBase, IqResponse, IqRequest } from './IqBase';

export interface SessionRequest extends IqRequest {
}

export interface SessionResponse extends IqResponse {
    host: string;
}

export class Session extends IqBase {

    public static readonly SESSION_XMLNS = 'urn:ietf:params:xml:ns:xmpp-session';

    public createResponse(response: SessionResponse): XMLWriter {
        return this.createIq(response.id, 'result')
            .attr('from', response.host)
    }

    public isRequest(request: XMLReader): boolean {
        return this.isIq(request, 'set', 'session', Session.SESSION_XMLNS);
    }

    public readRequest(request: XMLReader): SessionRequest {
        const session = request.getElement('session');
        return {
            id: this.readId(request),
        };
    }
}

import { XML } from '../xml/XML';
import { IqBase, IqRequest, IqResponse } from './IqBase';

export interface SessionRequest extends IqRequest {
}

export interface SessionResponse extends IqResponse {
}

export class Session extends IqBase {

    public static readonly SESSION_XMLNS = 'urn:ietf:params:xml:ns:xmpp-session';

    public createResponse(response: SessionResponse): XML {
        return this.createIq(response.id, 'result')
            .attr('from', response.from);
    }

    public isRequest(request: XML): boolean {
        return this.isIq(request, 'set', 'session', Session.SESSION_XMLNS);
    }

    public readRequest(request: XML): SessionRequest {
        const session = request.getElement('session');
        return {
            id: this.readId(request),
        };
    }
}

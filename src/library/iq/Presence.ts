import { ClientContext } from '../../server/xmpp/context/ClientContext';
import { ErrorStanza } from '../stanza/ErrorStanza';
import { XML } from '../xml/XML';
import { IqBase, IqRequest, IqResponse } from './IqBase';
import { PresenceBase, PresenceRequest, PresenceResponse, PresenceResponseType } from './PresenceBase';

/*export interface PresenceRequest extends PresenceRequest {
}

export interface PresenceResponse extends PresenceResponse {
}*/

export class Presence extends PresenceBase {

    // public static readonly PRESENCE_XMLNS = 'urn:ietf:params:xml:ns:xmpp-stanzas';
    // public static readonly PRESENCE_FEATURE_XMLNS = 'vcard-temp';

    public createResponse(response: PresenceResponse): XML {
        return this.createResponse1(response);
    }

    public isRequest(request: XML): boolean {
        return this.isPresence(request);
    }

    public readRequest(request: XML): PresenceRequest {
        const session = request.getElement('presence');
        return {
            to: this.readTo(request),
            type: this.readType(request),
        };
    }

    public createResponse1(response: PresenceResponse): XML {
        return this.createPresence(response.from, response.to, response.type)
            // .attr('to', response.to)
            // .attr('type', response.type)
        ;
    }

    /*public sendPresenceToUser(to: string, type: PresenceResponseType, user: User)
    {
        client.writeXML(this.createResponse({
            to: to,
            type: type,
        }));
    }*/

    public sendPresenceToClient(from: string, to: string, client: ClientContext, type?: PresenceResponseType) {
        // const to: string = client.jid.getUser();
        client.writeXML(
            this.createResponse({
                from,
                to,
                type,
            }));
    }
}

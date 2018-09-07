import { ErrorStanza } from '../stanza/ErrorStanza';
import { XML } from '../xml/XML';
import { IqBase, IqRequest, IqResponse } from './IqBase';

export interface VCardRequest extends IqRequest {
}

export interface VCardResponse extends IqResponse {
}

export class VCard extends IqBase {

    public static readonly VCARD_XMLNS = 'urn:ietf:params:xml:ns:xmpp-stanzas';
    public static readonly VCARD_FEATURE_XMLNS = 'vcard-temp';

    public createResponse(response: VCardResponse): XML {
        return this.createNotImpmementedError(response);
    }

    public isRequest(request: XML): boolean {
        return this.isIq(request, 'get', 'vCard');
    }

    public readRequest(request: XML): VCardRequest {
        const session = request.getElement('session');
        return {
            id: this.readId(request),
        };
    }

    public createCardNotFoundError(response: VCardResponse): XML {
        return this.createIq(response.id, 'error')
            .attr('to', response.to)
            .attr('from', response.from)
            .element(XML.create('vCard').xmlns('', VCard.VCARD_FEATURE_XMLNS))
             .element(ErrorStanza.vCardNotFound());
    }

    public createNotImpmementedError(response: VCardResponse): XML {
        return this.createIq(response.id, 'error')
            .attr('to', response.to)
            .attr('from', response.from)
            .element(ErrorStanza.featureNotImplemented());
    }
}

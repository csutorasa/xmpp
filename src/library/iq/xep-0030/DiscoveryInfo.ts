import { ErrorStanza } from '../../stanza/ErrorStanza';
import { XML } from '../../xml/XML';
import { IqBase, IqRequest, IqResponse } from '../IqBase';

export interface DiscoveryInfoRequest extends IqRequest {

}

export interface DiscoveryInfoResponse extends IqResponse {
    features: XML;
}

export interface Identity {
    category: string;
    type: string;
    name?: string;
    lang?: string;
}

export interface Feature {
    var: string;
}

export class DiscoveryInfo extends IqBase {

    public static readonly DISCOVERYINFO_XMLNS = 'http://jabber.org/protocol/disco#info';

    public createResponse(response: DiscoveryInfoResponse): XML {
        return this.createIq(response.id, 'result')
            .attr('to', response.to)
            .attr('from', response.from)
            .element(response.features);
    }

    public createIndentity(indenty: Identity): XML {
        const xml = XML.create('indentity')
            .attr('category', indenty.category)
            .attr('type', indenty.type);
        if (indenty.name) {
            xml.attr('name', indenty.name);
        }
        if (indenty.lang) {
            xml.attr('lang', indenty.lang);
        }
        return xml;
    }

    public createFeature(feature: Feature): XML {
        return XML.create('feature')
            .attr('var', feature.var);
    }

    public createError(response: DiscoveryInfoResponse): XML {
        return this.createIq(response.id, 'error')
            .attr('to', response.to)
            .attr('from', response.from)
            .element(XML.create('query')
                .xmlns('', DiscoveryInfo.DISCOVERYINFO_XMLNS),
        )
            .element(ErrorStanza.itemNotFound());
    }

    public isRequest(request: XML): boolean {
        return this.isIq(request, 'get', 'query', DiscoveryInfo.DISCOVERYINFO_XMLNS);
    }

    public readRequest(request: XML): DiscoveryInfoRequest {
        return {
            id: this.readId(request),
        };
    }
}

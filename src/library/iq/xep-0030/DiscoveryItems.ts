import { XML } from '../../xml/XML';
import { IqRequest, IqResponse, IqBase } from '../IqBase';

export interface DiscoveryItemsRequest extends IqRequest {
    
}

export interface DiscoveryItemsResponse extends IqResponse {
    to: string;
    from: string;
    items: Item[];
}

export interface Item {
    jid: string;
    name?: string;
}

export class DiscoveryItems extends IqBase {

    public static readonly DISCOVERYITEMS_XMLNS = 'http://jabber.org/protocol/disco#items';

    public createResponse(response: DiscoveryItemsResponse): XML {
        return this.createIq(response.id, 'result')
            .attr('to', response.to)
            .attr('from', response.from)
            .element(XML.create('query')
                .xmlns('', DiscoveryItems.DISCOVERYITEMS_XMLNS)
            )
    }

    public isRequest(request: XML): boolean {
        return this.isIq(request, 'get', 'query', DiscoveryItems.DISCOVERYITEMS_XMLNS);
    }

    public readRequest(request: XML): DiscoveryItemsRequest {
        return {
            id: this.readId(request),
        };
    }
}

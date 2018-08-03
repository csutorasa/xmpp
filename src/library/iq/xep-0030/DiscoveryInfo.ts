import { XMLWriter } from '../../xml/XMLWriter';
import { XMLReader } from '../../xml/XMLReader';
import { IqRequest, IqResponse, IqBase } from '../IqBase';

export interface DiscoveryInfoRequest extends IqRequest {
    
}

export interface DiscoveryInfoResponse extends IqResponse {
    to: string;
    from: string;
    indentities: Identity[];
    features: Feature[];
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

    public createResponse(response: DiscoveryInfoResponse): XMLWriter {
        return XMLWriter.create()
            .element('iq', XMLWriter.create()
                .attr('type', 'result')
                .attr('id', response.id)
                .attr('to', response.to)
                .attr('from', response.from)
                .element('query', XMLWriter.create()
                    .xmlns('', DiscoveryInfo.DISCOVERYINFO_XMLNS)
                )
            )
    }

    public createError(response: DiscoveryInfoResponse): XMLWriter {
        return XMLWriter.create()
            .element('iq', XMLWriter.create()
                .attr('type', 'error')
                .attr('id', response.id)
                .attr('to', response.to)
                .attr('from', response.from)
                .element('query', XMLWriter.create()
                    .xmlns('', DiscoveryInfo.DISCOVERYINFO_XMLNS)
                )
                .element('error ', XMLWriter.create()
                    .attr('type', 'cancel')
                    .element('item-not-found', XMLWriter.create()
                        .xmlns('', 'urn:ietf:params:xml:ns:xmpp-stanzas')
                    )
                )
            )
    }

    public isRequest(request: XMLReader): boolean {
        return this.isIq(request, 'get', 'query', DiscoveryInfo.DISCOVERYINFO_XMLNS);
    }

    public readRequest(request: XMLReader): DiscoveryInfoRequest {
        return {
            id: this.readId(request),
        };
    }
}

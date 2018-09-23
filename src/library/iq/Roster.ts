import { JID } from '../util/jid';
import { XML } from '../xml/XML';
import { IqBase, IqRequest, IqResponse } from './IqBase';

export interface RosterQueryRequest extends IqRequest {
    jid: string;
    type: string;
}

export interface RosterQueryResponse extends IqResponse {
    items: RosterItem[];
}

export interface RosterItem {
    jid: string; // JID;
    name: string;
    subscription: 'both' | 'from' | 'to' | 'none';
    groups: string[];
}

export class Roster extends IqBase {

    public static readonly ROSTER_XMLNS = 'jabber:iq:roster';

    public createResponse(response: RosterQueryResponse): XML {
        const items = response.items.map((i) => XML.create('item')
            .attr('jid', i.jid)// .getUser())
            .attr('name', i.name)
            .attr('subscription', i.subscription)
            .element(...i.groups.map((g) => XML.create('group').text(g))),
        );
        return this.createIq(response.id, 'result')
            .attr('from', response.from)
            .attr('to', response.to)
            .element(...items);
    }

    public isRequest(request: XML): boolean {
        return this.isIq(request, 'get', 'query', Roster.ROSTER_XMLNS)
         || this.isIq(request, 'set', 'query', Roster.ROSTER_XMLNS);
    }

    public readRequest(request: XML): RosterQueryRequest {
        /*
        INFO HandlerChain Processed iq type=set id=purple329517a9 [
            query xmlns=jabber:iq:roster [
                item jid=_JID_ [
                    group
                ]
            ]
        ]
        */
        const query = request.getElement('query');
        const item = query.getElement('item');
        // const jid = item.getAttr('jid');
        return {
            id: this.readId(request),
            jid: item ? item.getAttr('jid') : '',
            type: request.getAttr('type'),
        };
    }
}

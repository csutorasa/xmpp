import { XML } from '../xml/XML';

export interface PresenceRequest {
    to: string;
    type?: string;
}

export interface PresenceResponse {
    from?: string;
    to?: string;
    type?: PresenceResponseType;
}

export type PresenceRequestType = 'unavailable' | 'subscribe' | 'subscribed' | 'unsubscribe' | 'unsubscribed' | 'probe' | 'error';
export type PresenceResponseType = 'unavailable' | 'subscribe' | 'subscribed' | 'unsubscribe' | 'unsubscribed' | 'probe' | 'error'; // TODO

export abstract class PresenceBase {
    protected isPresence(request: XML): boolean {
        return request.getName() === 'presence';
    }

    protected readType(request: XML): string {
        return request.getAttr('type');
    }

    protected readTo(request: XML): string {
        return request.getAttr('to');
    }

    protected createPresence(from: string, to: string, type?: PresenceResponseType): XML {
        const xml: XML = XML.create('presence')
        .attr('from', from)
        .attr('to', to);
        if (type) {
            xml.attr('type', type);
        }
        return xml;
    }
}

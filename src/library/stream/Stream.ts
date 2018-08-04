import { XML } from '../xml/XML';
import { XMLEvent } from '../xml/XMLEvent';
import { XMLEventHelper } from '../xml/XMLEventHelper';

export interface StreamRequest {
    from: string;
    version: string;
}

export interface StreamResponse {
    from: string;
    to: string;
    id?: string;
    version?: string;
}

export class Stream {

    public static readonly JABBER_XMLNS = 'jabber:client';
    public static readonly STREAM_XMLNS = 'http://etherx.jabber.org/streams';
    public static readonly MECHANISMS_XMLNS = 'urn:ietf:params:xml:ns:xmpp-sasl';
    public static readonly COMPRESSION_XMLNS = 'http://jabber.org/features/compress';
    public static readonly VER_XMLNS = 'urn:xmpp:features:rosterver';
    public static readonly REGISTER_XMLNS = 'http://jabber.org/features/iq-register';

    public createOpenStreamMessage(response: StreamResponse): string {
        return XML.create('stream:stream', true)
            .text('')
            .xmlns('', Stream.JABBER_XMLNS)
            .xmlns('stream', Stream.STREAM_XMLNS)
            .attr('from', response.from)
            .attr('to', response.to)
            .attr('id', response.id ? response.id : Math.round(Math.random() * 10000000).toString(16))
            .attr('version', response.version ? response.version : '1.0')
            .attr('xml:lang', 'en')
            .toOpenXML();
    }

    public isOpenStreamMessage(request: XMLEvent): boolean {
        return XMLEventHelper.is(request, 'open', 'stream:stream')
            && request.attributes['xmlns'] === Stream.JABBER_XMLNS && request.attributes['xmlns:stream'] === Stream.STREAM_XMLNS;
    }

    public readOpenStreamMessage(request: XMLEvent): StreamRequest {
        return {
            from: request.attributes.from,
            version: request.attributes.version,
        }
    }

    public isCloseStreamMessage(request: XMLEvent): boolean {
        return XMLEventHelper.is(request, 'close', 'stream:stream');
    }

    public createCloseStreamMessage(): string {
        return '</stream:stream>';
    }
}

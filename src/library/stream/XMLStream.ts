import { XMLWriter } from '../xml/XMLWriter';

export class XMLStream {

    public static readonly JABBER_XMLNS = 'jabber:client';
    public static readonly STREAM_XMLNS = 'http://etherx.jabber.org/streams';
    public static readonly MECHANISMS_XMLNS = 'urn:ietf:params:xml:ns:xmpp-sasl';
    public static readonly COMPRESSION_XMLNS = 'http://jabber.org/features/compress';
    public static readonly VER_XMLNS = 'urn:xmpp:features:rosterver';
    public static readonly REGISTER_XMLNS = 'http://jabber.org/features/iq-register';

    public createOpenStreamMessage(from: string, to: string, id?: string): string {
        return XMLWriter.create()
            .element('stream:stream', XMLWriter.create()
                .attr('from', from)
                .attr('to', to)
                .attr('id', id)
                .attr('version', '1.0')
                .attr('xml:lang', 'en')
                .xmlns('', XMLStream.JABBER_XMLNS)
                .xmlns('stream', XMLStream.STREAM_XMLNS)
            ).toOpenXML();
    }

    public createCloseStreamMessage(): string {
        return '</stream:stream>';
    }

    public createFeaturesMessage(): XMLWriter {
        return XMLWriter.create()
            .element('stream:features', XMLWriter.create()
                .element('mechanisms', XMLWriter.create().xmlns('', XMLStream.MECHANISMS_XMLNS)
                    .element('mechanism', XMLWriter.create().text('PLAIN'), XMLWriter.create().text('SCRAM-SHA-1'), XMLWriter.create().text('CRAM-MD5'), XMLWriter.create().text('DIGEST-MD5'),
                )
                )
                .element('compression', XMLWriter.create().xmlns('', XMLStream.COMPRESSION_XMLNS)
                    .element('method', XMLWriter.create().text('zlib'))
                )
                .element('ver', XMLWriter.create().xmlns('', XMLStream.VER_XMLNS))
                .element('register', XMLWriter.create().xmlns('', XMLStream.REGISTER_XMLNS))
            )
    }
}
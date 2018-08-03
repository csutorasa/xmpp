import { XMLWriter } from '../xml/XMLWriter';
import { XMLEvent } from '../xml/XMLEvent';
import { XMLEventHelper } from '../xml/XMLEventHelper';

export interface FeaturesResponse {
    features: XMLWriter;
}

export class Features {

    public static readonly MECHANISMS_XMLNS = 'urn:ietf:params:xml:ns:xmpp-sasl';
    public static readonly COMPRESSION_XMLNS = 'http://jabber.org/features/compress';
    public static readonly VER_XMLNS = 'urn:xmpp:features:rosterver';
    public static readonly REGISTER_XMLNS = 'http://jabber.org/features/iq-register';
    public static readonly BIND_XMLNS = 'urn:ietf:params:xml:ns:xmpp-bind';
    public static readonly SESSION_XMLNS = 'urn:ietf:params:xml:ns:xmpp-session';

    public createFeaturesMessage(response: FeaturesResponse): XMLWriter {
        return response.features
            /*.element('mechanisms', XMLWriter.create().xmlns('', XMLStream.MECHANISMS_XMLNS)
                .element('mechanism', XMLWriter.create().text('PLAIN'), XMLWriter.create().text('SCRAM-SHA-1'), XMLWriter.create().text('CRAM-MD5'), XMLWriter.create().text('DIGEST-MD5'),)
            )
            .element('compression', XMLWriter.create().xmlns('', XMLStream.COMPRESSION_XMLNS)
                .element('method', XMLWriter.create().text('zlib'))
            )
            .element('ver', XMLWriter.create().xmlns('', XMLStream.VER_XMLNS))
            .element('register', XMLWriter.create().xmlns('', XMLStream.REGISTER_XMLNS))*/
    }
}

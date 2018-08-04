import { XML } from '../xml/XML';
import { XMLEvent } from '../xml/XMLEvent';
import { XMLEventHelper } from '../xml/XMLEventHelper';

export interface FeaturesResponse {
    features: XML;
}

export class Features {

    public static readonly MECHANISMS_XMLNS = 'urn:ietf:params:xml:ns:xmpp-sasl';
    public static readonly COMPRESSION_XMLNS = 'http://jabber.org/features/compress';
    public static readonly VER_XMLNS = 'urn:xmpp:features:rosterver';
    public static readonly REGISTER_XMLNS = 'http://jabber.org/features/iq-register';
    public static readonly BIND_XMLNS = 'urn:ietf:params:xml:ns:xmpp-bind';
    public static readonly SESSION_XMLNS = 'urn:ietf:params:xml:ns:xmpp-session';

    public createFeaturesMessage(response: FeaturesResponse): XML {
        return response.features
            /*.element('mechanisms', XML.create().xmlns('', XMLStream.MECHANISMS_XMLNS)
                .element('mechanism', XML.create().text('PLAIN'), XML.create().text('SCRAM-SHA-1'), XML.create().text('CRAM-MD5'), XML.create().text('DIGEST-MD5'),)
            )
            .element('compression', XML.create().xmlns('', XMLStream.COMPRESSION_XMLNS)
                .element('method', XML.create().text('zlib'))
            )
            .element('ver', XML.create().xmlns('', XMLStream.VER_XMLNS))
            .element('register', XML.create().xmlns('', XMLStream.REGISTER_XMLNS))*/
    }
}

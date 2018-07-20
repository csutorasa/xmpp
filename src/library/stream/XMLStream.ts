import { XMLHelper, XMLType } from '../xml/XMLHelper'

export class XMLStream {

    public static readonly JABBER_XMLNS = 'jabber:client';
    public static readonly STREAM_XMLNS = 'http://etherx.jabber.org/streams';
    public static readonly MECHANISMS_XMLNS = 'urn:ietf:params:xml:ns:xmpp-sasl';
    public static readonly COMPRESSION_XMLNS = 'http://jabber.org/features/compress';
    public static readonly VER_XMLNS = 'urn:xmpp:features:rosterver';
    public static readonly REGISTER_XMLNS = 'http://jabber.org/features/iq-register';

    public createStreamMessage(from: string, to: string, id?: string): XMLType {
        return {
            'stream:stream': {
                _attributes: {
                    from: from,
                    id: id,
                    to: to,
                    version: '1.0',
                    'xml:lang': 'en',
                    'xmlns': XMLStream.JABBER_XMLNS,
                    'xmlns:stream': XMLStream.STREAM_XMLNS
                }
            }
        }
    }

    public createFeaturesMessage(): XMLType {
        return {
            'stream:features': {
                'mechanisms': {
                    _attributes: {
                        'xmlns': XMLStream.MECHANISMS_XMLNS
                    },
                    'mechanism': [{
                        _text: 'PLAIN'
                    }, {
                        _text: 'SCRAM-SHA-1'
                    }, {
                        _text: 'CRAM-MD5'
                    }, {
                        _text: 'DIGEST-MD5'
                    }
                    ]
                },
                'compression': {
                    _attributes: {
                        'xlmns': XMLStream.COMPRESSION_XMLNS
                    },
                    method: {
                        _text: 'zlib'
                    }
                },
                'ver': {
                    _attributes: {
                        'xlmns': XMLStream.VER_XMLNS
                    }
                },
                'register': {
                    _attributes: {
                        'xlmns': XMLStream.REGISTER_XMLNS
                    }
                }
            }
        }
    }
}
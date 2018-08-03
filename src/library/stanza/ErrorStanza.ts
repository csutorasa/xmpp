import { XMLWriter } from "../xml/XMLWriter";

export type ErrorType = 'auth' | 'cancel' | 'continue' | 'modify' | 'wait';

export class ErrorStanza {
    public static readonly XMPPSTANZAS_XMLNS = 'urn:ietf:params:xml:ns:xmpp-stanzas';

    protected static createError(type: ErrorType): XMLWriter {
        return XMLWriter.create('error')
            .attr('type', type);
    }

    public static badRequest(): XMLWriter {
        return ErrorStanza.createError('modify')
            .element(
                XMLWriter.create('bad-request')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static conflict(): XMLWriter {
        return ErrorStanza.createError('cancel')
            .element(
                XMLWriter.create('conflict')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static featureNotImplemented(): XMLWriter {
        return ErrorStanza.createError('cancel') // or modify
            .element(
                XMLWriter.create('feature-not-implemented')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static forbidden(): XMLWriter {
        return ErrorStanza.createError('auth')
            .element(
                XMLWriter.create('forbidden')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static gone(by: string, uri: string): XMLWriter {
        return ErrorStanza.createError('cancel')
            .attr('by', by)
            .element(
                XMLWriter.create('gone')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
                    .text(uri)
            );
    }

    public static internalServerError(): XMLWriter {
        return ErrorStanza.createError('cancel')
            .element(
                XMLWriter.create('internal-server-error')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static itemNotFound(): XMLWriter {
        return ErrorStanza.createError('cancel')
            .element(
                XMLWriter.create('item-not-found')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static jidMalformed(by: string): XMLWriter {
        return ErrorStanza.createError('auth')
            .attr('by', by)
            .element(
                XMLWriter.create('jid-malformed')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static notAcceptable(): XMLWriter {
        return ErrorStanza.createError('modify')
            .element(
                XMLWriter.create('not-acceptable')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static notAllowed(): XMLWriter {
        return ErrorStanza.createError('cancel')
            .element(
                XMLWriter.create('not-allowed')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static notAuthorized(): XMLWriter {
        return ErrorStanza.createError('auth')
            .element(
                XMLWriter.create('not-authorized')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static policyViolation(by: string): XMLWriter {
        return ErrorStanza.createError('auth')
            .attr('by', by)
            .element(
                XMLWriter.create('policy-violation')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static recipientUnavailable(): XMLWriter {
        return ErrorStanza.createError('wait')
            .element(
                XMLWriter.create('recipient-unavailable')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static redirect(): XMLWriter {
        return ErrorStanza.createError('modify')
            .element(
                XMLWriter.create('redirect')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static registrationRequired(): XMLWriter {
        return ErrorStanza.createError('auth')
            .element(
                XMLWriter.create('registration-required')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static remoteServerNotFound(): XMLWriter {
        return ErrorStanza.createError('cancel')
            .element(
                XMLWriter.create('remote-server-not-found')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static remoteServerTimeout(): XMLWriter {
        return ErrorStanza.createError('wait')
            .element(
                XMLWriter.create('remote-server-timeout')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static resourceConstraint(): XMLWriter {
        return ErrorStanza.createError('wait')
            .element(
                XMLWriter.create('resource-constraint')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static serviceUnavailable(): XMLWriter {
        return ErrorStanza.createError('cancel')
            .element(
                XMLWriter.create('service-unavailable')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static subscriptionRequired(): XMLWriter {
        return ErrorStanza.createError('auth')
            .element(
                XMLWriter.create('subscription-required')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static undefinedCondition(): XMLWriter {
        return ErrorStanza.createError('modify')
            .element(
                XMLWriter.create('undefined-condition')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static unexpectedRequest(): XMLWriter {
        return ErrorStanza.createError('wait') // modify
            .element(
                XMLWriter.create('unexpected-request')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }
}
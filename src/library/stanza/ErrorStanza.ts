import { XML } from "../xml/XML";

export type ErrorType = 'auth' | 'cancel' | 'continue' | 'modify' | 'wait';

export class ErrorStanza {
    public static readonly XMPPSTANZAS_XMLNS = 'urn:ietf:params:xml:ns:xmpp-stanzas';

    protected static createError(type: ErrorType): XML {
        return XML.create('error')
            .attr('type', type);
    }

    public static badRequest(): XML {
        return ErrorStanza.createError('modify')
            .element(
                XML.create('bad-request')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static conflict(): XML {
        return ErrorStanza.createError('cancel')
            .element(
                XML.create('conflict')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static featureNotImplemented(): XML {
        return ErrorStanza.createError('cancel') // or modify
            .element(
                XML.create('feature-not-implemented')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static forbidden(): XML {
        return ErrorStanza.createError('auth')
            .element(
                XML.create('forbidden')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static gone(by: string, uri: string): XML {
        return ErrorStanza.createError('cancel')
            .attr('by', by)
            .element(
                XML.create('gone')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
                    .text(uri)
            );
    }

    public static internalServerError(): XML {
        return ErrorStanza.createError('cancel')
            .element(
                XML.create('internal-server-error')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static itemNotFound(): XML {
        return ErrorStanza.createError('cancel')
            .element(
                XML.create('item-not-found')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static jidMalformed(by: string): XML {
        return ErrorStanza.createError('auth')
            .attr('by', by)
            .element(
                XML.create('jid-malformed')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static notAcceptable(): XML {
        return ErrorStanza.createError('modify')
            .element(
                XML.create('not-acceptable')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static notAllowed(): XML {
        return ErrorStanza.createError('cancel')
            .element(
                XML.create('not-allowed')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static notAuthorized(): XML {
        return ErrorStanza.createError('auth')
            .element(
                XML.create('not-authorized')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static policyViolation(by: string): XML {
        return ErrorStanza.createError('auth')
            .attr('by', by)
            .element(
                XML.create('policy-violation')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static recipientUnavailable(): XML {
        return ErrorStanza.createError('wait')
            .element(
                XML.create('recipient-unavailable')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static redirect(): XML {
        return ErrorStanza.createError('modify')
            .element(
                XML.create('redirect')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static registrationRequired(): XML {
        return ErrorStanza.createError('auth')
            .element(
                XML.create('registration-required')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static remoteServerNotFound(): XML {
        return ErrorStanza.createError('cancel')
            .element(
                XML.create('remote-server-not-found')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static remoteServerTimeout(): XML {
        return ErrorStanza.createError('wait')
            .element(
                XML.create('remote-server-timeout')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static resourceConstraint(): XML {
        return ErrorStanza.createError('wait')
            .element(
                XML.create('resource-constraint')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static serviceUnavailable(): XML {
        return ErrorStanza.createError('cancel')
            .element(
                XML.create('service-unavailable')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static subscriptionRequired(): XML {
        return ErrorStanza.createError('auth')
            .element(
                XML.create('subscription-required')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static undefinedCondition(): XML {
        return ErrorStanza.createError('modify')
            .element(
                XML.create('undefined-condition')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }

    public static unexpectedRequest(): XML {
        return ErrorStanza.createError('wait') // modify
            .element(
                XML.create('unexpected-request')
                    .xmlns('', ErrorStanza.XMPPSTANZAS_XMLNS)
            );
    }
}
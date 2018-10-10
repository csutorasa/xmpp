import { User } from '../../server/xmpp/manager/User';
import { ILogger } from '../logger/Logger';
import { LoggerFactory } from '../logger/LoggerFactory';
import { JID } from '../util/jid';
import { XML } from '../xml/XML';

export interface MessageRequest {
    id: string;
    to: string;
    type: string;
    body?: XML;
}

export interface MessageResponse {
    from: string|JID;
    to: string|JID;
    type: string;
    body?: string|XML;
}

/*
2018-08-30T14:01:22.049Z INFO PresenceHandler not isRequest
2018-08-30T14:01:22.049Z INFO HandlerChain Unprocessable message type=chat id=purple10a7a37f to=a@d [
  composing xmlns=http://jabber.org/protocol/chatstates
]
2018-08-30T14:01:23.710Z INFO PresenceHandler not isRequest
2018-08-30T14:01:23.710Z INFO HandlerChain Unprocessable message type=chat id=purple10a7a380 to=a@d [
  active xmlns=http://jabber.org/protocol/chatstates
  body
]
2018-08-30T14:01:23.724Z INFO PresenceHandler not isRequest
2018-08-30T14:01:23.724Z INFO HandlerChain Unprocessable message type=chat id=purple10a7a381 to=a@d [
  active xmlns=http://jabber.org/protocol/chatstates
]

*/

// export type MessageType = 'chat' | 'error' | 'groupchat' | 'headline' | 'normal';

// export type MessageRequestType = 'unavailable' | 'subscribe' | 'subscribed' | 'unsubscribe' | 'unsubscribed' | 'probe' | 'error';
// export type MessageResponseType = 'unavailable' | 'subscribe' | 'subscribed' | 'unsubscribe' | 'unsubscribed' | 'probe' | 'error'; // TODO

export abstract class MessageBase {

    /*public static createMessageFromJID(from: JID, to: string, type: MessageType, body: string): XML {
            return createMessage(from.getBindedUser(), to, type, body);
    }*/

    public static createMessage(msg: MessageResponse): XML {
        return MessageBase.createMessageNative(msg.from, msg.to, msg.type, msg.body);
    }

    public static createMessageNative(from: string|JID|User, to: string|JID|User, type: string, msgBody?: string|XML): XML {
        let body: XML = null;
        if (msgBody instanceof XML) {
            body = msgBody;
        } else {
            body = XML.create('body').text(msgBody ? msgBody : '');
        }
        if (from instanceof User) {
            from = from.name;
        } else if (from instanceof JID) {
            from = from.getUser();
        }
        if (to instanceof User) {
            to = to.name;
        } else if (to instanceof JID) {
            to = to.getUser();
            // to = to.getBindedUser();
        }
        type = 'chat'; // TODO: override for Pigdin
        const xml: XML = XML.create('message')
        .attr('from', from)
        .attr('to', to)
        .attr('type', type)
        .attr('xml:lang', 'en')
        .element( body );
        MessageBase.log.info(JSON.stringify(xml));
        return xml;
    }

    private static readonly log: ILogger = LoggerFactory.create(MessageBase);
    protected isMessage(request: XML): boolean {
        return request.getName() === 'message';
    }

    protected readType(request: XML): string {
        return request.getAttr('type');
    }

    protected readId(request: XML): string {
        return request.getAttr('id');
    }

    protected readTo(request: XML): string {
        return request.getAttr('to');
    }

    protected readBody(request: XML): XML {
        return request.getElement('body');
        // const body: XML = request.getElement('body');
        // return body ? body.getContent() : null;
    }
}

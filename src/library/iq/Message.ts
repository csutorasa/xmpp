import { JID } from '../util/jid';
import { XML } from '../xml/XML';
import { MessageBase, MessageRequest, MessageResponse } from './MessageBase';
// import { IqBase, IqRequest, IqResponse } from './IqBase';

/*export interface MessageRequest extends IqRequest {
    //resource?: string;
}

export interface MessageResponse extends IqResponse {
    text: string;
}*/
export class Message extends MessageBase {

    // public static readonly MSG_XMLNS = 'urn:ietf:params:xml:ns:xmpp-bind';

    public createResponse(response: MessageResponse): XML {
        return Message.createMessage(response.from, response.to, response.type, response.body);
    }

    public isRequest(request: XML): boolean {
        return this.isMessage(request);
    }

    public readRequest(request: XML): MessageRequest {
        return {
            id: this.readId(request),
            to: this.readTo(request),
            type: this.readType(request),
            body: this.readBody(request),
        };
    }
}

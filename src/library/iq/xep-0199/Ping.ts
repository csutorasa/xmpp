import { XML } from '../../xml/XML';
import { IqBase, IqRequest, IqResponse } from '../IqBase';

export interface PingRequest extends IqRequest {

}

export interface PingResponse extends IqResponse {

}

export class Ping extends IqBase {

    public static readonly PING_XMLNS = 'urn:xmpp:ping';

    public createResponse(response: PingResponse): XML {
        return this.createIq(response.id, 'result')
            .attr('to', response.to)
            .attr('from', response.from);
    }

    public isRequest(request: XML): boolean {
        return this.isIq(request, 'get', 'ping', Ping.PING_XMLNS);
    }

    public readRequest(request: XML): PingRequest {
        return {
            id: this.readId(request),
        };
    }
}

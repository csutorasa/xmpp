import { XMLWriter } from '../../xml/XMLWriter';
import { XMLReader } from '../../xml/XMLReader';
import { IqRequest, IqResponse, IqBase } from '../IqBase';

export interface PingRequest extends IqRequest {

}

export interface PingResponse extends IqResponse {
    to: string;
    from: string;
}

export class Ping extends IqBase {

    public static readonly PING_XMLNS = 'urn:xmpp:ping';

    public createResponse(response: PingResponse): XMLWriter {
        return this.createIq(response.id, 'result')
            .attr('to', response.to)
            .attr('from', response.from)
    }

    public isRequest(request: XMLReader): boolean {
        return this.isIq(request, 'get', 'ping', Ping.PING_XMLNS);
    }

    public readRequest(request: XMLReader): PingRequest {
        return {
            id: this.readId(request),
        };
    }
}

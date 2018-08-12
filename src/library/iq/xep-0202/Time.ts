import { XML } from '../../xml/XML';
import { IqBase, IqRequest, IqResponse } from '../IqBase';

export interface TimeRequest extends IqRequest {

}

export interface TimeResponse extends IqResponse {
    time: Date;
}

export class Time extends IqBase {

    public static readonly TIME_XMLNS = 'urn:xmpp:time';

    public createResponse(response: TimeResponse): XML {
        const timezone = new Date().toString().match('[+-]\\d+')[0];
        return this.createIq(response.id, 'result')
            .attr('to', response.to)
            .attr('from', response.from)
            .element(
                XML.create('tzo').text(timezone.substr(0, 3) + ':' + timezone.substr(4)),
                XML.create('utc').text(response.time.toISOString()),
            );
    }

    public isRequest(request: XML): boolean {
        return this.isIq(request, 'get', 'time', Time.TIME_XMLNS);
    }

    public readRequest(request: XML): TimeRequest {
        return {
            id: this.readId(request),
        };
    }
}

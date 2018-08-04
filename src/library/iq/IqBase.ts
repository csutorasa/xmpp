import { XMLReader } from "../xml/XMLReader";
import { XMLWriter } from "../xml/XMLWriter";

export interface IqRequest {
    id: string;
}

export interface IqResponse {
    id: string;
}

export type IqRequestType = 'get' | 'set';
export type IqResponseType = 'result' | 'error';

export abstract class IqBase {
    protected isIq(request: XMLReader, type: IqRequestType, element?: string, namespace?: string): boolean {
        return request.getName() === 'iq' && request.getAttr('type') === type && ((element == null ||
            (request.getElement(element) != null && (namespace == null || request.getElement(element).getXmlns('') === namespace)))
        );
    }

    protected readId(request: XMLReader): string {
        return request.getAttr('id');
    }

    protected createIq(id: string, type: IqResponseType): XMLWriter {
        return XMLWriter.create('iq')
            .attr('type', type)
            .attr('id', id)
    }
}

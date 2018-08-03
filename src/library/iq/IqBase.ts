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
        const iq = request.getElement('iq');
        return iq.getAttr('type') === type && ((element == null ||
            (iq.getElement(element) != null && (namespace == null || iq.getElement(element).getXmlns('') === namespace)))
        );
    }

    protected readData(request: XMLReader, element: string): XMLReader {
        const iq = request.getElement('iq');
        return iq.getElement(element);
    }

    protected readId(request: XMLReader): string {
        return request.getElement('iq').getAttr('id');
    }

    protected createIq(id: string, type: IqResponseType): XMLWriter {
        return XMLWriter.create('iq')
            .attr('type', type)
            .attr('id', id)
    }
}

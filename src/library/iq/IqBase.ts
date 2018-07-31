import { XMLReader } from "../xml/XMLReader";

export interface IqRequest {
    id: string;
}

export interface IqResponse {
    id: string;
}

export abstract class IqBase {
    protected isIq(request: XMLReader, type: 'get' | 'set', element?: string, namespace?: string): boolean {
        const iq = request.getElement('iq');
        return iq != null && iq.getAttr('type') === type && ((element == null ||
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
}

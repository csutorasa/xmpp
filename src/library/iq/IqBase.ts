import { XML } from "../xml/XML";

export interface IqRequest {
    id: string;
}

export interface IqResponse {
    id: string;
}

export type IqRequestType = 'get' | 'set';
export type IqResponseType = 'result' | 'error';

export abstract class IqBase {
    protected isIq(request: XML, type: IqRequestType, element?: string, namespace?: string): boolean {
        return request.getName() === 'iq' && request.getAttr('type') === type && ((element == null ||
            (request.getElement(element) != null && (namespace == null || request.getElement(element).getXmlns('') === namespace)))
        );
    }

    protected readId(request: XML): string {
        return request.getAttr('id');
    }

    protected createIq(id: string, type: IqResponseType): XML {
        return XML.create('iq')
            .attr('type', type)
            .attr('id', id)
    }
}

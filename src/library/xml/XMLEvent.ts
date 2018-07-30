export type XMLEventType = 'open' | 'close' | 'data' | 'instruction';

export interface XMLEvent {
    type: XMLEventType;
    name?: string;
    attributes?: { [key: string]: string };
    data?: string;
}

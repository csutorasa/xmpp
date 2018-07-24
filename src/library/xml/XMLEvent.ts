export interface XMLEvent {
    type: 'open' | 'close' | 'data' | 'instruction';
    name?: string;
    attributes?: { [key: string]: string };
    data?: string;
}

import * as Parser from 'node-xml-stream-parser'
import { XMLEvent } from './XMLEvent';

export class XMLStreamReader {

    protected parser = new Parser();
    protected content: XMLEvent[] = [];
    protected handlers: ((event: XMLEvent) => void)[] = [];

    constructor() {
        this.parser.on('opentag', (name: string, attributes: { [key: string]: string }) => {
            const event: XMLEvent = {
                type: 'open',
                name: name,
                attributes: attributes,
            };
            this.runEventHandlers(event);
        });
        this.parser.on('closetag', (name: string) => {
            const event: XMLEvent = {
                type: 'close',
                name: name,
            };
            this.runEventHandlers(event);
        });
        this.parser.on('text', (text: string) => {
            const event: XMLEvent = {
                type: 'data',
                data: text,
            };
            this.runEventHandlers(event, false);
        });
        this.parser.on('cdata', (cdata: string) => {
            const event: XMLEvent = {
                type: 'data',
                data: cdata,
            };
            this.runEventHandlers(event, false);
        });
        this.parser.on('instruction', (name: string, attributes: { [key: string]: string }) => {
            const event: XMLEvent = {
                type: 'instruction',
                name: name,
                attributes: attributes,
            };
            this.runEventHandlers(event);
        });
    }

    protected runEventHandlers(event: XMLEvent, run: boolean = true): void {
        this.content.push(event);
        this.handlers.forEach(e => {
            e(event);
        });
    }

    public on(handler: () => void): void {
        this.handlers.push(handler);
    }

    public append(data: string): void {
        this.parser.write(data);
    }

    public getContent(): XMLEvent[] {
        return this.content;
    }
}



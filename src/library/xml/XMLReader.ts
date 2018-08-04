import { xml2js, ElementCompact, Element } from 'xml-js'
import { XMLEvent } from './XMLEvent';

export class XMLReader {

    protected attributes: { [key: string]: string; } = {};
    protected declaration: {
        attributes?: {
            version?: string | number
            encoding?: 'utf-8' | string
            standalone?: 'yes' | 'no'
        }
    };
    protected content: string | number | boolean;
    protected isCdata: boolean = false;
    protected elements: XMLReader[] = [];

    public constructor(protected name: string) {

    }

    public static fromXML(xml: string): XMLReader {
        return this.fromElement(<Element>xml2js(xml, { alwaysArray: true }));
    }

    public static fromOpenXML(xml: string): XMLReader {
        return this.fromXML(xml.replace(/>$/, "/>"));
    }

    public static fromEvents(events: XMLEvent[], parent: XMLReader = null): XMLReader[] {
        const readers: XMLReader[] = [];
        let lastReader: XMLReader;
        const processableEvents = events.filter(e => e.type !== 'instruction' || e.name === 'xml');
        while (processableEvents.length !== 0) {
            const event = processableEvents[0];
            if (event.type === 'open') {
                const to = processableEvents.findIndex(e => e.type === 'close' && e.name == event.name);
                if(to === -1) {
                    throw new Error('Cannot find closing tag for ' + event.name);
                }
                lastReader = new XMLReader(event.name);
                Object.assign(lastReader.attributes, event.attributes);
                const innerEvents = processableEvents.splice(0, to + 1);
                const newElements = this.fromEvents(innerEvents.slice(1, -1), lastReader);
                lastReader.elements.push(...newElements);
                readers.push(lastReader);
            } else if (event.type === 'data') {
                parent.content = event.data;
                processableEvents.shift();
            } else if (event.type === 'instruction') {
                if (event.attributes.version || event.attributes.encoding) {
                    if (!lastReader.attributes) {
                        lastReader.declaration = {};
                    }
                    if (event.attributes.version) {
                        lastReader.declaration.attributes.version = event.attributes.version;
                    }
                    if (event.attributes.encoding) {
                        lastReader.declaration.attributes.encoding = event.attributes.encoding;
                    }
                }
                processableEvents.shift();
            } else {
                throw new Error('Invalid event ' + event.type);
            }
        }
        return readers;
    }

    public getName(): string {
        return this.name;
    }

    public getAttr(key: string): string {
        return this.attributes[key];
    }

    public getXmlns(ns: string): string {
        if (ns === '') {
            return this.attributes.xmlns;
        } else {
            return this.attributes['xmlns:' + ns];
        }
    }

    public getContent(): string {
        return this.content + '';
    }

    public getElement(name: string): XMLReader {
        return this.elements.find(e => e.name === name);
    }

    public getElements(): XMLReader[] {
        return this.elements;
    }

    protected static fromElement(element: Element): XMLReader {
        const reader = new XMLReader(element.name);
        if (element.declaration) {
            reader.declaration = {
                attributes: {}
            }
            Object.assign(reader.declaration.attributes, element.declaration.attributes);
        }
        if (element.attributes) {
            Object.assign(reader.attributes, element.attributes);
        }

        if (element.elements) {
            const contentChildren = element.elements.filter(e => e.type === 'text' || e.type === 'cdata');
            const elementChildren = element.elements.filter(e => e.type !== 'text' && e.type !== 'cdata');
            if (contentChildren.length !== 0) {
                if (contentChildren.filter(e => e.type === 'cdata').length !== 0) {
                    reader.content = contentChildren.filter(e => e.type === 'cdata')[0].cdata;
                    reader.isCdata = true;
                } else {
                    reader.content = contentChildren.filter(e => e.type === 'text')[0].text;
                    reader.isCdata = true;
                }
            }
            for (let elem of elementChildren) {
                reader.elements.push(this.fromElement(elem));
            }
        }
        return reader;
    }

    public toReadableString(): string {
        const attr = Object.keys(this.attributes).length > 0 ? (' {' + Object.keys(this.attributes).map(a => a + ': ' + this.attributes[a]).join(', ') + '}') : '';
        const elements = this.elements.length > 0 ? " [" + this.elements.map(e => '\n' + e.toReadableString()).join('').split('\n').join('\n  ') + "\n]" : '';
        return [
            this.name,
            attr,
            elements,
        ].join('');
    }
}

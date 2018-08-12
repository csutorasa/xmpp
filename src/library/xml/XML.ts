import { Element, js2xml, xml2js } from 'xml-js';
import { XMLEvent } from './XMLEvent';

export class XML {

    public static fromXML(xml: string): XML {
        return this.fromElement(xml2js(xml, { alwaysArray: true }) as Element);
    }

    public static fromOpenXML(xml: string): XML {
        return this.fromXML(xml.replace(/>$/, '/>'));
    }

    public static fromEvents(events: XMLEvent[], parent: XML = null): XML[] {
        const readers: XML[] = [];
        let lastReader: XML;
        const processableEvents = events.filter((e) => e.type !== 'instruction' || e.name === 'xml');
        while (processableEvents.length !== 0) {
            const event = processableEvents[0];
            if (event.type === 'open') {
                const to = processableEvents.findIndex((e) => e.type === 'close' && e.name === event.name);
                if (to === -1) {
                    throw new Error('Cannot find closing tag for ' + event.name);
                }
                lastReader = new XML(event.name);
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

    public static create(name: string, addHeader: boolean = false): XML {
        const factory = new XML(name);
        if (addHeader) {
            factory.declaration = {
                attributes: {
                    version: '1.0',
                    encoding: 'utf-8',
                },
            };
        }
        return factory;
    }

    protected static fromElement(element: Element): XML {
        const reader = new XML(element.name);
        if (element.declaration) {
            reader.declaration = {
                attributes: {},
            };
            Object.assign(reader.declaration.attributes, element.declaration.attributes);
        }
        if (element.attributes) {
            Object.assign(reader.attributes, element.attributes);
        }

        if (element.elements) {
            const contentChildren = element.elements.filter((e) => e.type === 'text' || e.type === 'cdata');
            const elementChildren = element.elements.filter((e) => e.type !== 'text' && e.type !== 'cdata');
            if (contentChildren.length !== 0) {
                if (contentChildren.filter((e) => e.type === 'cdata').length !== 0) {
                    reader.content = contentChildren.filter((e) => e.type === 'cdata')[0].cdata;
                    reader.isCdata = true;
                } else {
                    reader.content = contentChildren.filter((e) => e.type === 'text')[0].text;
                    reader.isCdata = true;
                }
            }
            for (const elem of elementChildren) {
                reader.elements.push(this.fromElement(elem));
            }
        }
        return reader;
    }
    protected attributes: { [key: string]: string; } = {};
    protected declaration: {
        attributes?: {
            version?: string | number
            encoding?: 'utf-8' | string
            standalone?: 'yes' | 'no',
        },
    };
    protected content: string | number | boolean;
    protected isCdata: boolean = false;
    protected elements: XML[] = [];

    public constructor(protected name: string) {

    }

    public getName(): string {
        return this.name;
    }

    public attr(key: string, value: string): XML {
        this.attributes[key] = value;
        return this;
    }

    public getAttr(key: string): string {
        return this.attributes[key];
    }

    public xmlns(ns: string, url: string): XML {
        if (ns === '') {
            this.attributes.xmlns = url;
        } else {
            this.attributes['xmlns:' + ns] = url;
        }
        return this;
    }

    public getXmlns(ns: string): string {
        if (ns === '') {
            return this.attributes.xmlns;
        } else {
            return this.attributes['xmlns:' + ns];
        }
    }

    public text(data: string): XML {
        this.content = data;
        this.isCdata = false;
        return this;
    }

    public cdata(data: string): XML {
        this.content = data;
        this.isCdata = true;
        return this;
    }

    public getContent(): string {
        return this.content + '';
    }

    public element(...element: XML[]): XML {
        this.elements.push(...element);
        return this;
    }

    public getElement(name: string): XML {
        return this.elements.find((e) => e.name === name);
    }

    public getElements(): XML[] {
        return this.elements;
    }

    public toXML(): string {
        const originalElement = this.toElement();
        const element: Element = {
            declaration: originalElement.declaration,
            elements: [ originalElement ],
            type: 'element',
        };
        return js2xml(element, { compact: false }).replace(/"/g, "'");
    }

    public toOpenXML(): string {
        const xml = this.toXML();
        return xml.substr(0, xml.lastIndexOf('</'));
    }

    public toReadableString(): string {
        const attr = Object.keys(this.attributes).length > 0 ?
            (' ' + Object.keys(this.attributes).map((a) => a + '=' + this.attributes[a]).join(' ')) : '';
        const elements = this.elements.length > 0 ? ' [' + this.elements.map((e) => '\n' + e.toReadableString()).join('').split('\n').join('\n  ') + '\n]' : '';
        return [
            this.name,
            attr,
            elements,
        ].join('');
    }

    protected toElement(): Element {
        const data: Element = {
            name: this.name,
            type: 'element',
        };
        if (this.declaration) {
            data.declaration = {
                attributes: {},
            };
            Object.assign(data.declaration.attributes, this.declaration.attributes);
        }
        if (Object.keys(this.attributes).length !== 0) {
            data.attributes = {};
            Object.assign(data.attributes, this.attributes);
        }
        if (Object.keys(this.elements).length === 0) {
            if (this.content != null) {
                if (this.isCdata) {
                    data.elements = [{type: 'cdata', cdata: this.content + ''}];
                } else {
                    data.elements = [{type: 'text', text: this.content}];
                }
            }
        } else {
            data.elements = this.elements.map((f) => f.toElement());
            data.elements.forEach((e) => e.type = 'element');
        }
        return data;
    }
}

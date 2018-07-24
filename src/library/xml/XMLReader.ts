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
    } = null;
    protected content: string | number | boolean;
    protected isCdata: boolean = false;
    protected elements: { [key: string]: XMLReader[] } = {};

    public static fromXML(xml: string): XMLReader {
        return this.fromElement(<Element>xml2js(xml, { alwaysArray: true }));
    }

    public static fromOpenXML(xml: string): XMLReader {
        return this.fromXML(xml.replace(/>$/, "/>"));
    }

    public static fromEvents(events: XMLEvent[]): XMLReader {
        const reader = new XMLReader();
        const processableEvents = events.filter(e => e.type !== 'instruction' || e.name === 'xml');
        while (processableEvents.length !== 0) {
            const event = processableEvents[0];
            if (event.type === 'open') {
                const to = processableEvents.findIndex(e => e.type === 'close' && e.name == event.name);
                if(to === -1) {
                    throw new Error('Cannot find closing tag for ' + event.name);
                }
                if(!reader.elements[event.name]) {
                    reader.elements[event.name] = []
                }
                const innerEvents = processableEvents.splice(0, to + 1);
                const newElement = this.fromEvents(innerEvents.slice(1, -1));
                newElement.attributes = {}
                Object.assign(newElement.attributes, event.attributes);
                reader.elements[event.name].push(newElement);
            } else if (event.type === 'data') {
                reader.content = event.data;
                processableEvents.shift();
            } else if (event.type === 'instruction') {
                if (event.attributes.version || event.attributes.encoding) {
                    if (!reader.attributes) {
                        reader.declaration = {};
                    }
                    if (event.attributes.version) {
                        reader.declaration.attributes.version = event.attributes.version;
                    }
                    if (event.attributes.encoding) {
                        reader.declaration.attributes.encoding = event.attributes.encoding;
                    }
                }
                processableEvents.shift();
            } else {
                throw new Error('Invalid event ' + event.type);
            }
        }
        return reader;
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
        return this.elements[name] && this.elements[name].length > 0 ? this.elements[name][0] : null;
    }

    public getElements(name: string): XMLReader[] {
        return this.elements[name] && this.elements[name].length > 0 ? this.elements[name] : [];
    }

    protected static fromElement(element: Element): XMLReader {
        const reader = new XMLReader();
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
                if (!reader.elements[elem.name]) {
                    reader.elements[elem.name] = []
                }
                reader.elements[elem.name].push(this.fromElement(elem));
            }
        }
        return reader;
    }
}



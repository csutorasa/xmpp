import { js2xml, Element } from 'xml-js'

export class XMLWriter {

    protected attributes: { [key: string]: string; } = {};
    protected declaration: {
        attributes?: {
            version?: string | number
            encoding?: 'utf-8' | string
            standalone?: 'yes' | 'no'
        }
    };
    protected content: string;
    protected isCdata: boolean = false;
    protected elements: XMLWriter[] = [];

    public constructor(protected name: string) {

    }

    public static create(name: string, addHeader: boolean = false): XMLWriter {
        const factory = new XMLWriter(name);
        if (addHeader) {
            factory.declaration = {
                attributes: {
                    version: '1.0',
                    encoding: 'utf-8',
                }
            };
        };
        return factory;
    }

    public attr(key: string, value: string): XMLWriter {
        this.attributes[key] = value;
        return this;
    }

    public xmlns(ns: string, url: string): XMLWriter {
        if (ns === '') {
            this.attributes.xmlns = url;
        } else {
            this.attributes['xmlns:' + ns] = url;
        }
        return this;
    }

    public text(data: string): XMLWriter {
        this.content = data;
        this.isCdata = false;
        return this;
    }

    public cdata(data: string): XMLWriter {
        this.content = data;
        this.isCdata = true;
        return this;
    }

    public getElement(name: string): XMLWriter {
        return this.elements[name] && this.elements[name].length > 0 ? this.elements[name][0] : null;
    }

    public getElements(name: string): XMLWriter[] {
        return this.elements[name] && this.elements[name].length > 0 ? this.elements[name] : [];
    }

    public element(...element: XMLWriter[]): XMLWriter {
        this.elements.push(...element);
        return this;
    }

    protected toElement(): Element {
        const data: Element = {
            name: this.name,
            type: 'element',
        };
        if (this.declaration) {
            data.declaration = {
                attributes: {}
            }
            Object.assign(data.declaration.attributes, this.declaration.attributes);
        }
        if(Object.keys(this.attributes).length !== 0) {
            data.attributes = {};
            Object.assign(data.attributes, this.attributes);
        }
        if (Object.keys(this.elements).length === 0) {
            if (this.content != null) {
                if (this.isCdata) {
                    data.elements = [{type: 'cdata', cdata: this.content}];
                } else {
                    data.elements = [{type: 'text', text: this.content}];
                }
            }
        } else {
            data.elements = this.elements.map(f => f.toElement());
            data.elements.forEach(e => e.type = 'element');
        }
        return data;
    }

    public toXML(): string {
        const originalElement = this.toElement();
        const element: Element = {
            declaration: originalElement.declaration,
            elements: [ originalElement ],
            type: 'element',
        }
        return js2xml(element, { compact: false }).replace(/"/g, "'");
    }

    public toOpenXML(): string {
        const xml = this.toXML();
        return xml.substr(0, xml.lastIndexOf('</'));
    }
}



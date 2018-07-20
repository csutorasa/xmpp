import { js2xml, ElementCompact } from 'xml-js'

export class XMLWriter {

    protected attributes: { [key: string]: string; } = {};
    protected declaration: {
        attributes?: {
            version?: string | number
            encoding?: 'utf-8' | string
            standalone?: 'yes' | 'no'
        }
    } = null;
    protected content: string;
    protected isCdata: boolean = false;
    protected elements: { [key: string]: XMLWriter[] } = {};

    public static create(addHeader: boolean = false): XMLWriter {
        const factory = new XMLWriter();
        if (addHeader) {
            factory.declaration = {
                attributes: {
                    version: '1.0',
                    encoding: 'utf-8'
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
        if(ns === '') {
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

    public element(name: string, element: XMLWriter): XMLWriter {
        if (!this.elements[name]) {
            this.elements[name] = [];
        }
        this.elements[name].push(element);
        return this;
    }

    protected toElementCompact(): ElementCompact {
        const data: ElementCompact = {};
        if(this.declaration) {
            data._declaration = {
                _attributes: {}
            }
            Object.assign(data._declaration._attributes, this.declaration.attributes);
        }
        data._attributes = {};
        Object.assign(data._attributes, this.attributes);
        if (Object.keys(this.elements).length === 0) {
            if (this.isCdata) {
                data._cdata = this.content;
            } else {
                data._text = this.content;
            }
        } else {
            for (let name in this.elements) {
                data[name] = this.elements[name].map(f => f.toElementCompact());
            }
        }
        return data;
    }

    public toXML(): string {
        return js2xml(this.toElementCompact(), { compact: true })
    }

    public toOpenXML(): string {
        return this.toXML().replace(/\/>$/, ">");
    }
}



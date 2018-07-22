import { xml2js, ElementCompact } from 'xml-js'

export class XMLReader {

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
    protected elements: { [key: string]: XMLReader[] } = {};

    public static fromXML(xml: string): XMLReader {
        return this.fromElementCompact(xml2js(xml, { compact: true }));
    }

    public static fromOpenXML(xml: string): XMLReader {
        return this.fromXML(xml.replace(/>$/, "/>"));
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
        return this.content;
    }

    public getElement(name: string): XMLReader {
        return this.elements[name] && this.elements[name].length > 0 ? this.elements[name][0] : null;
    }

    public getElements(name: string): XMLReader[] {
        return this.elements[name] && this.elements[name].length > 0 ? this.elements[name] : [];
    }

    protected static fromElementCompact(element: ElementCompact): XMLReader {
        const reader = new XMLReader();
        if (element._declaration) {
            reader.declaration = {
                attributes: {}
            }
            Object.assign(reader.declaration.attributes, element._declaration._attributes);
        }
        if (element._attributes) {
            Object.assign(reader.attributes, element._attributes);
        }
        if (Object.keys(element).filter(k => k.indexOf('_') !== 0).length === 0) {
            if (element._cdata) {
                reader.content = element._cdata;
                reader.isCdata = true;
            } else {
                reader.content = element._text + '';
                reader.isCdata = true;
            }
        } else {
            for (let name of Object.keys(element).filter(k => k.indexOf('_') !== 0)) {
                if (element[name] instanceof Array) {
                    reader.elements[name] = element[name].map(f => this.fromElementCompact(f));
                } else {
                    reader.elements[name] = [this.fromElementCompact(element[name])];
                }
            }
        }
        return reader;
    }
}



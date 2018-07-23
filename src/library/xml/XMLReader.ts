import { xml2js, ElementCompact, Element } from 'xml-js'

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



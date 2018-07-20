import { js2xml, xml2js, ElementCompact } from 'xml-js'

export type XMLType = ElementCompact;

export class XMLHelper {

    public fromXML(xml: string): XMLType {
        return xml2js(xml, { compact: true });
    }

    public fromOpenXML(xml: string): XMLType {
        return this.fromXML(xml.replace(/>$/, "/>"));
    }
}



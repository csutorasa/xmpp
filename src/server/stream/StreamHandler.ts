import { Handler, XMLType, XMLStream, HandlerContext, XMLWriter } from "../../library";


export class StreamHandler extends Handler {
    protected xmlStream = new XMLStream();

    public isSupportedRaw(context: HandlerContext, request: string): boolean {
        const xml = this.xmlHelper.fromOpenXML(request);
        return xml['stream:stream'] != null;
    }

    public handleRaw(context: HandlerContext, request: string): void {
        const xml = this.xmlHelper.fromOpenXML(request);
        const data = XMLWriter.create()
            .element('stream:stream', XMLWriter.create()
                .attr('from', 'arminpc')
                .attr('to', xml['stream:stream']._attributes.from)
                .attr('id', '++TR84Sm6A3hnt3Q065SnAbbk3Y=')
                .attr('version', '')
                .attr('xml:lang', '')
                .xmlns('', XMLStream.JABBER_XMLNS)
                .xmlns('stream', XMLStream.STREAM_XMLNS)
            )
            .toOpenXML();
        context.writeRaw(data);
        context.write(this.xmlStream.createFeaturesMessage());
    }
}
import { XMLType, XMLHelper } from "../xml/XMLHelper";
import { HandlerContext } from "./HandlerContext";

export abstract class Handler {
    protected xmlHelper = new XMLHelper();

    public init(): void {

    }

    public isSupportedRaw(context: HandlerContext, request: string): boolean {
        return this.isSupported(context, this.xmlHelper.fromXML(request));
    }
    
    public isSupported(context: HandlerContext, request: XMLType): boolean {
        return false;
    }

    public handleRaw(context: HandlerContext, request: string): void {
        return this.handle(context, this.xmlHelper.fromXML(request));
    }

    public handle(context: HandlerContext, request: XMLType): void {
        
    }
}
import { Handler } from "./Handler";
import { XMLType } from "../xml/XMLHelper";
import { HandlerContext } from "./HandlerContext";


export class HandlerChain {

    protected readonly handlers: Handler[] = [];

    public register(handler: Handler): HandlerChain {
        this.handlers.push(handler);
        return this;
    }

    public deregister(handler: Handler): void {
        this.handlers.splice(this.handlers.indexOf(handler), 1);
    }

    public execute(context: HandlerContext, request: string): void {
        const supported = this.handlers.filter(h => h.isSupportedRaw(context, request));
        if(supported.length > 1) {
            throw new Error('Ambiguous handlers are found.');
        }
        if(supported.length == 1) {
            supported[0].handleRaw(context, request);
        }
    }
}
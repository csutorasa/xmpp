import { Handler } from "./Handler";
import { ClientContext } from "../context/ClientContext";
import { ServerContext } from "../context/ServerContext";

export class HandlerChain {

    protected readonly handlers: Handler[] = [];

    public register(handler: Handler): HandlerChain {
        this.handlers.push(handler);
        return this;
    }

    public deregister(handler: Handler): void {
        this.handlers.splice(this.handlers.indexOf(handler), 1);
    }

    public execute(server: ServerContext, client: ClientContext, request: string): void {
        const supported = this.handlers.filter(h => this.isSupported(h, server, client, request));
        if (supported.length > 1) {
            throw new Error('Ambiguous handlers are found.');
        }
        if (supported.length == 1) {
            supported[0].handleRaw(server, client, request);
        }
    }

    protected isSupported(handler: Handler, server: ServerContext, client: ClientContext, request: string): boolean {
        try {
            return handler.isSupportedRaw(server, client, request);
        } catch {
            return false;
        }
    }
}
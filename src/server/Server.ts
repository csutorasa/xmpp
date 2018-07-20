import { HandlerChain, Handler, HandlerContext } from "../library";

export abstract class Server {
    
    protected readonly handlerChain = new HandlerChain();

    public addHandler(handler: Handler): Server {
        handler.init();
        this.handlerChain.register(handler);
        return this;
    }

    public removeHandler(handler: Handler): void {
        this.handlerChain.deregister(handler);
    }

    protected onData(context: HandlerContext, data: string): void {
        console.log(data);
        this.handlerChain.execute(context, data);
    }

    abstract start(port: number): void;

    abstract stop(port: number): void;
}

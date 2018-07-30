import { ClientContext } from "../context/ClientContext";
import { ServerContext } from "../context/ServerContext";
import { XMLEvent } from "../../../library";

export abstract class Handler {

    public init(context: ServerContext): void {

    }

    public abstract isSupported(server: ServerContext, client: ClientContext, events: XMLEvent[]): boolean;

    public abstract handle(server: ServerContext, client: ClientContext, events: XMLEvent[]): void;
}
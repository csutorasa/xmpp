import { XMLReader } from "../../library";
import { ClientContext } from "../context/ClientContext";
import { ServerContext } from "../context/ServerContext";
import { XMLEvent } from "../../library/xml/XMLEvent";

export abstract class Handler {

    public init(context: ServerContext): void {

    }

    public abstract isSupported(server: ServerContext, client: ClientContext, events: XMLEvent[]): boolean;

    public abstract handle(server: ServerContext, client: ClientContext, events: XMLEvent[]): void;
}
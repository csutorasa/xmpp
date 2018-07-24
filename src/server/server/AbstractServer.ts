import { XMLStream } from "../../library";
import { Socket } from "net";
import { ClientContext } from "../context/ClientContext";
import { XMLEvent } from "../../library/xml/XMLEvent";

export abstract class AbstractServer {

    public inputHandler: (context: ClientContext, data: string) => void;
    public inputXMLHandler: (context: ClientContext, events: XMLEvent[]) => void;
    public outputHandler: (context: ClientContext, data: string, promise: Promise<any>) => void;

    protected closeClient(socket: Socket) {
        socket.write(new XMLStream().createCloseStreamMessage(), 'utf-8');
    }

    abstract start(): Promise<any>;

    abstract stop(): Promise<void>;
}

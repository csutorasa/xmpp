import { XMLWriter } from "../../library";
import { Socket } from "net";

export enum ClientState {
    Connecting,
    Connected,
    Authenticated,
    Disconnecting,
    Disconnected,
}

export interface ClientContext {
    state: ClientState;
    username?: string;
    resource?: string;
    writeString: (response: string) => void;
    writeXML: (response: XMLWriter) => void;
    close: () => void;
}
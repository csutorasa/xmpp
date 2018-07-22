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
    writeRaw: (response: string) => void;
    write: (response: XMLWriter) => void;
    close: () => void;
}
import { XMLWriter } from "../../library";
import { Socket } from "net";

export enum ClientState {
    Connecting,
    Connected,
    Disconnecting,
    Disconnected,
}

export interface ClientContext {
    state: ClientState;
    writeRaw: (response: string) => void;
    write: (response: XMLWriter) => void;
    close: () => void;
}
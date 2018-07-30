import { XMLWriter } from "../../../library";

export enum ClientState {
    Connecting,
    Connected,
    Authenticated,
    Normal,
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
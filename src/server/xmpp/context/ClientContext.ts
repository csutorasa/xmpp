import { XML } from '../../../library';
import { JID } from '../../../library/util/jid';

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
    jid?: JID;
    writeString: (response: string) => void;
    writeXML: (response: XML) => void;
    close: () => void;
}

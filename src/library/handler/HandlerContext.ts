import { XMLType } from "../xml/XMLHelper";

export interface HandlerContext {
    resource?: string;
    writeRaw: (response: string) => void;
    write: (response: XMLType) => void;
}
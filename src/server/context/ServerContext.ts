import { XMLWriter } from "../../library";

export interface ServerContext {
    hostname?: string;
    features?: XMLWriter;
    authfeatures?: XMLWriter;
}
import { XMLWriter } from "../../../library";

export interface ServerContext {
    hostname?: string;
    sessionFeatures?: XMLWriter;
    authFeatures?: XMLWriter;
}
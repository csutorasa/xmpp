import { XML } from "../../../library";

export interface ServerContext {
    hostname?: string;
    sessionFeatures?: XML;
    authFeatures?: XML;
}
import { XML } from "../../../library";

export interface ServerContext {
    hostname?: string;
    sessionFeatures?: XML;
    authFeatures?: XML;
    discoveryItems?: XML;
    discoveryInfo?: XML;
}
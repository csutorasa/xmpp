export interface Configuration {
    db?: {
        url?: string;
        dbname?: string;
    };
    logging?: {
        logFilePath?: string;
        consoleLevel?: string;
        fileLevel?: string;
    };
    server?: {
        tcpPort?: number;
        tcpsPort?: number;
        wsPort?: number;
        wssPort?: number;
    };
}

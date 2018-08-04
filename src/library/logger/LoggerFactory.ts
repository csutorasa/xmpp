import { Logger, LogLevel } from "./Logger";
import { ConsoleLogger } from "./ConsoleLogger";

export class LoggerFactory {
    public static create(type: { new(): any }): Logger {
        const logger: Logger = new ConsoleLogger(type);
        logger.setLevel(LogLevel.Info);
        return logger;
    }
}
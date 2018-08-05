import { ConsoleLogger } from './ConsoleLogger';
import { ILogger, LogLevel } from './Logger';

export class LoggerFactory {
    public static create(type: { new(): any }): ILogger {
        const logger: ILogger = new ConsoleLogger(type);
        logger.setLevel(LogLevel.Info);
        return logger;
    }
}

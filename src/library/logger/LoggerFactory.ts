import { ConfigurationManager } from '../../server/config/ConfigurationManager';
import { ConsoleLogger } from './ConsoleLogger';
import { FileLogger } from './FileLogger';
import { ILogger, LogLevel, parseLogLevel } from './Logger';
import { MultipleLogger } from './MultipleLogger';

export class LoggerFactory {
    public static create(type: { name: string }): ILogger {
        const logger: MultipleLogger = new MultipleLogger(type);
        if (ConfigurationManager.getConfiguration().logging.consoleLevel) {
            const consoleLogger: ILogger = new ConsoleLogger(type);
            consoleLogger.setLevel(parseLogLevel(ConfigurationManager.getConfiguration().logging.consoleLevel));
            logger.addLogger(consoleLogger);
        }
        if (ConfigurationManager.getConfiguration().logging.logFilePath && ConfigurationManager.getConfiguration().logging.fileLevel) {
            const fileLogger: ILogger = new FileLogger(type, ConfigurationManager.getConfiguration().logging.logFilePath);
            fileLogger.setLevel(parseLogLevel(ConfigurationManager.getConfiguration().logging.fileLevel));
            logger.addLogger(fileLogger);
        }
        return logger;
    }
}

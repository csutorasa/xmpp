/* tslint:disable:no-console */
import { AbstractLogger, LogLevel } from './Logger';

export class ConsoleLogger extends AbstractLogger {

    protected static readonly Loggers = {
        [LogLevel.Error]: console.error,
        [LogLevel.Warn]: console.warn,
        [LogLevel.Info]: console.info,
        [LogLevel.Debug]: console.debug,
        [LogLevel.Trace]: console.trace,
    };

    protected doLog(level: LogLevel, message: string): void {
        ConsoleLogger.Loggers[level](message);
    }
}

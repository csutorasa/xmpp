/* tslint:disable:no-console */
import * as chalk from 'chalk';
import { AbstractLogger, LogLevel } from './Logger';

export class ConsoleLogger extends AbstractLogger {

    protected static readonly Loggers = {
        [LogLevel.Error]: console.error,
        [LogLevel.Warn]: console.warn,
        [LogLevel.Info]: console.info,
        [LogLevel.Debug]: console.debug,
        [LogLevel.Trace]: console.trace,
    };

    protected static readonly Colors = {
        [LogLevel.Error]: chalk.default.red,
        [LogLevel.Warn]: chalk.default.yellow,
        [LogLevel.Info]: chalk.default.white,
        [LogLevel.Debug]: chalk.default.green,
        [LogLevel.Trace]: chalk.default.blue,
    };

    protected doLog(level: LogLevel, message: string): void {
        ConsoleLogger.Loggers[level](this.colorMessage(level, message));
    }

    protected colorMessage(level: LogLevel, message: string): string {
        return ConsoleLogger.Colors[level](message);
    }
}

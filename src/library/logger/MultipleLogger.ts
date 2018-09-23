import { AbstractLogger, ILogger, LogLevel } from './Logger';

export class MultipleLogger extends AbstractLogger {

    protected readonly loggers: ILogger[] = [];

    public constructor(type: { new(): any }) {
        super(type);
    }

    public addLogger(logger: ILogger): void {
        this.loggers.push(logger);
    }

    public log(level: LogLevel, param: string | (() => string)): void {
        this.loggers.forEach((l) => { l.log(level, param); });
    }

    protected doLog(level: LogLevel, message: string): void {
        // Unused
    }
}

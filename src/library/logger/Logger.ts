export enum LogLevel {
    Error,
    Warn,
    Info,
    Debug,
    Trace,
}

export function parseLogLevel(level: string): LogLevel {
    if (level.match(/error/i)) {
        return LogLevel.Error;
    }
    if (level.match(/warn/i)) {
        return LogLevel.Warn;
    }
    if (level.match(/info/i)) {
        return LogLevel.Info;
    }
    if (level.match(/debug/i)) {
        return LogLevel.Debug;
    }
    if (level.match(/trace/i)) {
        return LogLevel.Trace;
    }
    return LogLevel.Info;
}

export interface ILogger {
    error(message: string | (() => string)): void;
    warn(message: string | (() => string)): void;
    info(message: string | (() => string)): void;
    debug(message: string | (() => string)): void;
    trace(message: string | (() => string)): void;
    log(level: LogLevel, message: string | (() => string)): void;
    getLevel(): LogLevel;
    setLevel(level: LogLevel): void;
}

export abstract class AbstractLogger implements ILogger {
    private static readonly Names = {
        [LogLevel.Error]: 'ERROR',
        [LogLevel.Warn]: 'WARN',
        [LogLevel.Info]: 'INFO',
        [LogLevel.Debug]: 'DEBUG',
        [LogLevel.Trace]: 'TRACE',
    };
    protected readonly name: string;
    private level: LogLevel = LogLevel.Info;

    public constructor(type: { new(): any }) {
        this.name = type.name;
    }

    public error(param: string | (() => string)): void {
        this.log(LogLevel.Error, param);
    }
    public warn(param: string | (() => string)): void {
        this.log(LogLevel.Warn, param);
    }
    public info(param: string | (() => string)): void {
        this.log(LogLevel.Info, param);
    }
    public debug(param: string | (() => string)): void {
        this.log(LogLevel.Debug, param);
    }
    public trace(param: string | (() => string)): void {
        this.log(LogLevel.Trace, param);
    }
    public log(level: LogLevel, param: string | (() => string)): void {
        if (level <= this.level) {
            let str: string;
            if (param instanceof Function) {
                str = param();
            } else {
                str = param;
            }
            this.doLog(level, this.format(str));
        }
    }

    public getLevel(): LogLevel {
        return this.level;
    }
    public setLevel(level: LogLevel): void {
        this.level = level;
    }

    protected abstract doLog(level: LogLevel, message: string): void;
    protected levelToString(level: LogLevel): string {
        return AbstractLogger.Names[level];
    }
    protected getTime(): string {
        return new Date().toISOString();
    }

    protected format(message: string) {
        return this.getTime() + ' ' + this.levelToString(this.getLevel()) + ' ' + this.name + ' ' + message;
    }
}

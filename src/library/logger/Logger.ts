export enum LogLevel {
    Error,
    Warn,
    Info,
    Debug,
    Trace,
}

export interface Logger {
    error(message: string): void;
    error(factory: () => string): void;
    warn(message: string): void;
    warn(factory: () => string): void;
    info(message: string): void;
    info(factory: () => string): void;
    debug(message: string): void;
    debug(factory: () => string): void;
    trace(message: string): void;
    trace(factory: () => string): void;
    log(level: LogLevel, message: string): void;
    log(level: LogLevel, factory: () => string): void;
    getLevel(): LogLevel;
    setLevel(level: LogLevel): void;
}

export abstract class AbstractLogger implements Logger {
    private static readonly Names = {
        [LogLevel.Error]: 'ERROR',
        [LogLevel.Warn]: 'WARN',
        [LogLevel.Info]: 'INFO',
        [LogLevel.Debug]: 'DEBUG',
        [LogLevel.Trace]: 'TRACE',
    };
    private level: LogLevel = LogLevel.Info;
    protected readonly name: string;

    public constructor(type: { new(): any }) {
        this.name = type.name;
    }

    public error(message: string): void;
    public error(factory: () => string): void;
    public error(param: string | (() => string)): void {
        this.log(LogLevel.Error, param);
    }
    public warn(message: string): void;
    public warn(factory: () => string): void;
    public warn(param: string | (() => string)): void {
        this.log(LogLevel.Warn, param);
    }
    public info(message: string): void;
    public info(factory: () => string): void;
    public info(param: string | (() => string)): void {
        this.log(LogLevel.Info, param);
    }
    public debug(message: string): void;
    public debug(factory: () => string): void;
    public debug(param: string | (() => string)): void {
        this.log(LogLevel.Debug, param);
    }
    public trace(message: string): void;
    public trace(factory: () => string): void;
    public trace(param: string | (() => string)): void {
        this.log(LogLevel.Trace, param);
    }
    public log(level: LogLevel, message: string): void;
    public log(level: LogLevel, factory: () => string): void;
    public log(level: LogLevel, param: string | (() => string)): void;
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

    protected abstract doLog(level: LogLevel, message: string): void;

    public getLevel(): LogLevel {
        return this.level;
    }
    public setLevel(level: LogLevel): void {
        this.level = level;
    }
    protected levelToString(level: LogLevel): string {
        return AbstractLogger.Names[level];
    }
    protected getTime(): string {
        return new Date().toISOString();
    }

    protected format(message: string) {
        return this.getTime() + " " + this.levelToString(this.getLevel()) + " " + this.name + " " + message;
    }
}

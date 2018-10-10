/* tslint:disable:no-console */
import * as fs from 'fs';
import { AbstractLogger, LogLevel } from './Logger';

export class FileLogger extends AbstractLogger {

    public constructor(type: { name: string }, protected filename: string) {
        super(type);
    }

    protected doLog(level: LogLevel, message: string): void {
        fs.appendFile(this.filename, message, (err) => {
            if (err) {
                return console.log('Failed to write to file ' + err.message);
            }
        });
    }
}

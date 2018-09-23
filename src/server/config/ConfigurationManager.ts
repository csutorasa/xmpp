import * as fs from 'fs';
import { Configuration } from './Configuration';

export class ConfigurationManager {

    public static getConfiguration(): Configuration {
        return ConfigurationManager.instance.configuration;
    }

    private static instance: ConfigurationManager = new ConfigurationManager();
    private configuration: Configuration;

    constructor() {
        const content = fs.readFileSync(process.argv[2], { encoding: 'utf8' }).toString();
        this.configuration = JSON.parse(content);
    }
}

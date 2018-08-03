export class JID {
    public constructor(public host: string, public name?: string, public resource?: string) {

    }

    public stringify(): string {
        if (this.name) {
            if (this.resource) {
                return this.name + '@' + this.host + '/' + this.resource;
            } else {
                return this.name + '@' + this.host;
            }
        } else {
            return this.host + '/' + this.resource;
        }
    }

    public static parse(data: string): JID {
        const at = data.split('@');
        const name = at.length > 1 ? at.shift() : null;
        const slash = at.join('@').split('/');
        const host = slash.length > 1 ? slash.shift() : null;
        return new JID(name, host,slash.join('/'));
    }
}

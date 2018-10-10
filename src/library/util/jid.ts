export class JID {

    public static parse(data: string): JID {
        const at = data.split('@');
        const name = at.length > 1 ? at.shift() : null;
        const slash = at.join('@').split('/');
        const host = slash.length > 0 ? slash.shift() : null;
        return new JID(host, name, slash.join('/'));
    }
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

    public getUser(): string {
        if (this.hasUser()) {
            return this.name + '@' + this.host;
        } else {
            return null;
        }
    }

    public getBindedUser(): string {
        if (this.hasUser()) {
            return this.name + '@' + this.host + (this.hasResource() ? '/' + this.resource : '');
        } else {
            return null;
        }
    }

    public hasUser(): boolean {
        return this.name != null && this.name.length > 0;
    }

    public hasResource(): boolean {
        return this.resource != null && this.resource.length > 0;
    }
}

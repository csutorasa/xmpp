export interface JID {
    name: string;
    host: string;
    resource: string;
}

export class JIDHelper {
    public static toString(jid: JID): string {
        if(jid.name) {
            if(jid.resource) {
                return jid.name + '@' + jid.host + '/' + jid.resource;
            } else {
                return jid.name + '@' + jid.host;
            }
        } else {
            return jid.host + '/' + jid.resource;
        }
    }

    public static parse(data: string): JID {
        const at = data.split('@');
        const name = at.length > 1 ? at.shift() : null;
        const slash = at.join('@').split('/');
        const host = slash.length > 1 ? slash.shift(): null;
        return {
            name: name,
            host: host,
            resource: slash.join('/')
        };
    }
}

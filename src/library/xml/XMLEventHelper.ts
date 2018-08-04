import { XMLEvent } from "./XMLEvent";
import { XMLReader } from "./XMLReader";

export class XMLEventHelper {

    public static is(event: XMLEvent, type: 'open' | 'close', name: string): boolean {
        return event != null && event.type === type && event.name === name;
    }

    public static has(events: XMLEvent[], type: 'open' | 'close', name: string): boolean {
        return events.find(e => e.type === type && e.name === name) != null;
    }

    public static isCompleteTag(events: XMLEvent[], name?: string): boolean {
        if (events.length < 2) {
            return false;
        }
        const open = events[0];
        if (name && name !== open.name) {
            return false;
        }
        return this.has(events, 'close', open.name);
    }

    public static getTag(events: XMLEvent[]): XMLReader {
        if (events.length < 2) {
            return undefined;
        }
        const open = events[0];
        const close = events.findIndex(e => e.type === 'close' && e.name === open.name);
        if (close === -1) {
            return undefined;
        }
        return XMLReader.fromEvents(events.slice(0, close + 1))[0];
    }

    public static processFirst(events: XMLEvent[]): XMLEvent {
        return events.shift();
    }

    public static processTag(events: XMLEvent[]): XMLReader {
        if (events.length < 2) {
            return undefined;
        }
        const open = events[0];
        const close = events.findIndex(e => e.type === 'close' && e.name === open.name);
        if (close === -1) {
            return undefined;
        }
        return XMLReader.fromEvents(events.splice(0, close + 1))[0];
    }
}

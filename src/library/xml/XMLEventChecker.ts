import { XML } from "./XML";

export class XMLEventChecker {

    protected value: boolean = true;
    
    public constructor(protected reader: XML) {

    }

    public check(): boolean {
        return this.value;
    }

    public hasAttr(attr: string) {
        if (this.value) {
            this.value = this.reader.getAttr(attr) != null;
        }
    }

    public hasChild(type: string) {
        if (this.value) {
            this.value = this.reader.getElement(type) != null;
        }
    }

    public contentMatch(content: string) {
        if (this.value) {
            this.value = this.reader.getContent() == content;
        }
    }
}

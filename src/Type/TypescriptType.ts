import { PrimitiveType } from "./PrimitiveType";

export class TypescriptType extends PrimitiveType {
    public constructor(private type: string) {
        super();
    }

    public getId(): string {
        return this.type;
    }
}

import { PrimitiveType } from "./PrimitiveType";

export class StaticType extends PrimitiveType {
    public constructor(private type: string) {
        super();
    }

    public getId(): string {
        return this.type;
    }
}

import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { StaticType } from "../Type/StaticType";

export class StaticNodeFormatter implements SubTypeFormatter {
    public supportsType(type: StaticType): boolean {
        return type instanceof StaticType;
    }
    public getDefinition(type: StaticType): Definition {
        return { type: type.getId() as "string" };
    }
    public getChildren(type: StaticType): BaseType[] {
        return [];
    }
}

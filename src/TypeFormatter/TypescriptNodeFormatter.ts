import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { TypescriptType } from "../Type/TypescriptType";

export class TypescriptNodeFormatter implements SubTypeFormatter {
    public supportsType(type: TypescriptType): boolean {
        return type instanceof TypescriptType;
    }
    public getDefinition(type: TypescriptType): Definition {
        return { type: type.getId() as "string" };
    }
    public getChildren(type: TypescriptType): BaseType[] {
        return [];
    }
}

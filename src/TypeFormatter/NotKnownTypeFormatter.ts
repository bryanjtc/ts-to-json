import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { NotKnownType } from "../Type/NotKnownType";

export class NotKnownTypeFormatter implements SubTypeFormatter {
    public supportsType(type: NotKnownType): boolean {
        return type instanceof NotKnownType;
    }
    public getDefinition(type: NotKnownType): Definition {
        return { type: type.getId() as "string" };
    }
    public getChildren(type: NotKnownType): BaseType[] {
        return [];
    }
}

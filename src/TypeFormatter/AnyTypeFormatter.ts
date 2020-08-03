import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { AnyType } from "../Type/AnyType";
import { BaseType } from "../Type/BaseType";
import { Config } from "../Config";

export class AnyTypeFormatter implements SubTypeFormatter {
    public constructor(private config: Config) {}
    public supportsType(type: AnyType): boolean {
        return type instanceof AnyType;
    }
    public getDefinition(type: AnyType): Definition {
        if (this.config.allowArbitraryDataTypes) {
            return { type: "any" as "string" };
        } else {
            return {};
        }
    }
    public getChildren(type: AnyType): BaseType[] {
        return [];
    }
}

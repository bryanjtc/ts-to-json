import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { UnknownSymbolType } from "../Type/UnknownSymbolType";
import { Config } from "../Config";

export class UnknownSymbolTypeFormatter implements SubTypeFormatter {
    public constructor(private config: Config) {}
    public supportsType(type: UnknownSymbolType): boolean {
        return type instanceof UnknownSymbolType;
    }
    public getDefinition(type: UnknownSymbolType): Definition {
        return { type: type.getName() as any };
    }
    public getChildren(type: UnknownSymbolType): BaseType[] {
        return [];
    }
}

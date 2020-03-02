import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { TypescriptType } from "../Type/TypescriptType";
import { symbolAtNode } from "../Utils/symbolAtNode";
import { Config } from "../../src/Config";

/*
    To prevent circular errors and UnknownNodeError for types like HTMLElement
    Will parse types within '/node_modules/typescript/'
*/

export class TypescriptNodeParser implements SubNodeParser {
    constructor(private config: Config) {}
    public supportsNode(node: ts.Node): boolean {
        if (!this.config.useTypescriptTypeName) return false;
        // if ((node as any).name.text === "getComputedStyle") return false;
        const symbol = symbolAtNode(node);
        return symbol ? true : false;
    }
    public createType(node: ts.Node, context: Context): BaseType {
        const symbol = symbolAtNode(node)!;
        return new TypescriptType(symbol.name);
    }
}

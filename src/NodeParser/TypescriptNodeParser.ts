import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { TypescriptType } from "../Type/TypescriptType";
import { symbolAtNode } from "../Utils/symbolAtNode";

/*
    To prevent circular errors and UnknownNodeError for types like HTMLElement
    Will parse types within '/node_modules/typescript/'
*/

export class TypescriptNodeParser implements SubNodeParser {
    public supportsNode(node: ts.Node): boolean {
        if (process.env.__TEST__) return false;
        const symbol = symbolAtNode(node);
        return symbol ? true : false;
    }
    public createType(node: ts.Node, context: Context): BaseType {
        const symbol = symbolAtNode(node)!;
        return new TypescriptType(symbol.name);
    }
}

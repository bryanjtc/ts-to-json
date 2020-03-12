import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { StaticType } from "../Type/StaticType";
import { symbolAtNode } from "../Utils/symbolAtNode";
import { Config } from "../../src/Config";

/*
    To skip processing type in a file expansive types like HTMLElement
    instead will return type name e.g. HTMLElement
*/

export class SkippedFileTypeParser implements SubNodeParser {
    constructor(private config: Config) {}
    public supportsNode(node: ts.Node): boolean {
        if (!this.config.skipFiles || !this.config.skipFiles.length) return false;
        const symbol = symbolAtNode(node);
        return symbol ? true : false;
    }
    public createType(node: ts.Node, context: Context): BaseType {
        const symbol = symbolAtNode(node)!;
        return new StaticType(symbol.name);
    }
}

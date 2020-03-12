import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { StaticType } from "../Type/StaticType";
import { symbolAtNode } from "../Utils/symbolAtNode";
import { Config } from "../../src/Config";

/*
    To skip processing types specified in skipTypes options
    will return type name specified in list: skipTypes:['Promise'] will return Promise
*/

export class SkippedTypeParser implements SubNodeParser {
    constructor(private config: Config) {}
    public supportsNode(node: ts.Node): boolean {
        if (!this.config.skipTypes || !this.config.skipTypes.length) return false;
        const symbol = symbolAtNode(node);
        if (!symbol) return false;
        if (!this.config.skipTypes.includes(symbol.name)) return false;
        return true;
    }
    public createType(node: ts.Node, context: Context): BaseType {
        const symbol = symbolAtNode(node)!;
        return new StaticType(symbol.name);
    }
}

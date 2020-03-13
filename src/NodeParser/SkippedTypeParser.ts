import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { StaticType } from "../Type/StaticType";
import { symbolAtNode } from "../Utils/symbolAtNode";
import { Config } from "../../src/Config";
import { isInSkipTypes } from "../Utils/isInSkipTypes";
import { isInProcessTypes } from "../Utils/isInProcessTypes";
import { UnknownType } from "../Type/UnknownType";

/*
    To skip processing types specified in skipTypes options
    will return type name specified in list: skipTypes:['Promise'] will return Promise
*/

export class SkippedTypeParser implements SubNodeParser {
    constructor(private config: Config) {}
    public supportsNode(node: ts.Node): boolean {
        const text = node.getText().trim();
        if (text === "infer RefType") {
            console.log();
        }
        if (isInProcessTypes(node, this.config)) return false;
        if (isInSkipTypes(node, this.config)) {
            return true;
        }
        return false;
    }
    public createType(node: ts.Node, context: Context): BaseType {
        const symbol = symbolAtNode(node)!;
        if (symbol) return new StaticType(symbol.name);
        return new UnknownType();
    }
}

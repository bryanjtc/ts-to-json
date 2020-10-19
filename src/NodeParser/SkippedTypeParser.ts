import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { StaticType } from "../Type/StaticType";
import { Config } from "../../src/Config";
import { isInSkipTypes } from "../Utils/isInSkipTypes";
import { isInForceParseTypes } from "../Utils";
import { UnknownType } from "../Type/UnknownType";
import { getNodeName, isFunctionKind } from "../Utils";

/*
    To skip processing types specified in skipTypes options
    will return type name specified in list: skipTypes:['Promise'] will return Promise
*/

export class SkippedTypeParser implements SubNodeParser {
    constructor(private config: Config) {}
    public supportsNode(node: ts.Node): boolean {
        if (isInForceParseTypes(node, this.config)) return false;
        if (isInSkipTypes(node, this.config)) {
            return true;
        }
        return false;
    }
    public createType(node: ts.Node, context: Context): BaseType {
        const name = getNodeName(node);

        if (
            this.config &&
            this.config.skipParseTypes &&
            this.config.skipParseTypes.includes("function") &&
            isFunctionKind(node)
        ) {
            return new StaticType("function");
        }

        if (name) return new StaticType(name);
        return new UnknownType();
    }
}

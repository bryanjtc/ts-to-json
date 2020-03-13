import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { UnknownType } from "../Type/UnknownType";
import { symbolAtNode } from "../Utils/symbolAtNode";
import { Config } from "../Config";

export class NotKnownTypeParser implements SubNodeParser {
    public constructor(private config: Config) {}
    public supportsNode(node: ts.TypeQueryNode): boolean {
        if (!this.config.handleUnknownTypes) return false;
        if (node.exprName) return true;
        const symbol = symbolAtNode(node);
        if (!symbol) return false;
        return true;
    }
    public createType(node: ts.TypeQueryNode, context: Context): BaseType {
        return new UnknownType();
    }
}

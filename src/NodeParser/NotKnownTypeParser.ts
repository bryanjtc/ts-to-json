import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { NotKnownType } from "../Type/NotKnownType";
import { symbolAtNode } from "../Utils/symbolAtNode";

export class NotKnownTypeParser implements SubNodeParser {
    public supportsNode(node: ts.TypeQueryNode): boolean {
        if (node.exprName) return true;
        const symbol = symbolAtNode(node);
        if (!symbol) return false;
        return true;
    }
    public createType(node: ts.TypeQueryNode, context: Context): BaseType {
        if (node.exprName) return new NotKnownType(node.exprName.getText());
        const symbol = symbolAtNode(node)!;
        return new NotKnownType(symbol.name);
    }
}

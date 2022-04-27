import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { StaticType } from "../Type/StaticType";
import { BaseType } from "../Type/BaseType";

export class PromiseNodeParser implements SubNodeParser {
    public constructor(private typeChecker: ts.TypeChecker) {}

    public supportsNode(node: ts.TypeNode): boolean {
        if (!ts.isTypeReferenceNode(node)) return false;

        if (node.typeName.getText() !== "Promise") return false;

        const type = this.typeChecker.getTypeFromTypeNode(node) as unknown as ts.TypeReferenceNode;

        if (!type.typeArguments || !type.typeArguments.length) return false;

        return true;
    }
    public createType(node: ts.TypeReferenceNode, context: Context): BaseType {
        return new StaticType(node.getText());
    }
}

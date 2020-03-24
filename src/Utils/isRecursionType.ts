import * as ts from "typescript";
import { isTopLevelDeclarations, getNodeName } from ".";

export const isRecursionType = (node: ts.Node, parentNode: ts.Node): boolean | undefined => {
    if (
        ts.isPropertySignature(node) &&
        isTopLevelDeclarations(parentNode) &&
        (node.type as any).typeName &&
        (node.type as any).typeName.text === getNodeName(parentNode)
    )
        return true;
    if (parentNode.parent) {
        return isRecursionType(node, parentNode.parent);
    }
    return false;
};

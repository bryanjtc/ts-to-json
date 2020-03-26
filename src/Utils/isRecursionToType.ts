import { getNodeName, isChildOfTypeReference } from ".";
import { Context } from "../NodeParser";
import * as ts from "typescript";

export const isRecursionToType = (node: ts.Node, context: Context, typeName?: string) => {
    if (!typeName) return false;
    const sameAsConfigType = getNodeName(node) === typeName;
    const isChildOfType = isChildOfTypeReference(context, typeName) && sameAsConfigType;
    return isChildOfType;
};

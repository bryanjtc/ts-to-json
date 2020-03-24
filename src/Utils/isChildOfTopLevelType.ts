import * as ts from "typescript";
import { isTopLevelDeclarations, getNodeName } from "../Utils";

export const isChildOfTopLevelType = (node?: ts.Node, topLevelTypeName?: string): boolean | undefined => {
    if (!node || !topLevelTypeName) return false;
    if (isTopLevelDeclarations(node) && getNodeName(node) === topLevelTypeName) return true;
    if (node.parent) return isChildOfTopLevelType(node.parent, topLevelTypeName);
    return false;
};

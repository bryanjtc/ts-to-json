import * as ts from "typescript";
import { getNodeName } from ".";

export const isTopLevelDeclarations = (node: ts.Node) => {
    switch (node.kind) {
        case ts.SyntaxKind.InterfaceDeclaration:
        case ts.SyntaxKind.EnumDeclaration:
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.VariableStatement:
        case ts.SyntaxKind.TypeAliasDeclaration:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.ModuleDeclaration:
            return true;
        default:
            return false;
    }
};
export const getClosestTopLevelDeclarations = (node: ts.Node): ts.Node | undefined => {
    if (isTopLevelDeclarations(node)) return node;
    if (node.parent) {
        return getClosestTopLevelDeclarations(node.parent);
    }
    return undefined;
};

export const getClosestTopLevelDeclarationName = (node?: ts.Node) => {
    if (!node) return;
    const topNode = getClosestTopLevelDeclarations(node);
    if (topNode) {
        return getNodeName(topNode);
    }
    return;
};

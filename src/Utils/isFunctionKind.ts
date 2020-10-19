import * as ts from "typescript";

export const isFunctionKind = (node: ts.Node) => {
    return (
        node.kind === ts.SyntaxKind.FunctionDeclaration ||
        node.kind === ts.SyntaxKind.FunctionType ||
        node.kind === ts.SyntaxKind.MethodSignature
    );
};

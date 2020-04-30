import * as ts from "typescript";

export const getPropNode = (node: ts.Node): ts.Node | undefined => {
    if (ts.isSourceFile(node)) return;

    if (
        [ts.SyntaxKind.PropertySignature, ts.SyntaxKind.PropertyDeclaration, ts.SyntaxKind.MethodSignature].includes(
            node.kind
        )
    ) {
        return node;
    }
    if (node.parent) {
        return getPropNode(node.parent);
    }

    return;
};

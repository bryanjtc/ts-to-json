import * as ts from "typescript";

export const getPropTypeNode = (node: ts.Node) => {
    if (ts.isPropertySignature(node)) return node.type;
    return;
};

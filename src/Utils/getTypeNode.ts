import * as ts from "typescript";

export const getNodeTypeNode = (node: ts.Node) => {
    if (!ts.isPropertySignature(node)) return;
    return node.type;
};

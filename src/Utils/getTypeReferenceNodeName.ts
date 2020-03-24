import * as ts from "typescript";
// import { getNodeTypeNode } from ".";

export const getTypeReferenceNodeName = (node?: ts.Node) => {
    if (!node || !ts.isTypeReferenceNode(node)) return;
    return node.typeName.getText();
};

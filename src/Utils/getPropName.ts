import * as ts from "typescript";
import { getPropNode, getNodeName } from ".";

export const getPropName = (node: ts.Node) => {
    const propNode = getPropNode(node);
    if (!propNode) return;
    return getNodeName(propNode);
};

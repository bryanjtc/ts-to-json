import * as ts from "typescript";
import { localSymbolAtNode, symbolAtNode } from "./symbolAtNode";
export const getNodeName = (node: ts.Node): string | undefined => {
    const symbol = symbolAtNode(node);
    if (symbol) return symbol?.name;
    const symbolLocale = localSymbolAtNode(node);
    if (symbolLocale) return symbolLocale.name;
    if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
        return node.typeName.escapedText as string;
    }
    return node.getText();
};

import * as ts from "typescript";
import { localSymbolAtNode, symbolAtNode } from "./symbolAtNode";
export const getNodeName = (node: ts.Node) => {
    const symbol = symbolAtNode(node);
    if (symbol) return symbol?.name;
    const symbolLocale = localSymbolAtNode(node);
    if (symbolLocale) return symbolLocale.name;
    return;
};

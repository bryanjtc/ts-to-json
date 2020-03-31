import * as ts from "typescript";
import { Config } from "../../src/Config";
import { symbolAtNode, localSymbolAtNode } from ".";

export const isInForceParseTypes = (node: ts.Node, config: Config) => {
    if (!config.forceToParseTypes || !config.forceToParseTypes.length) return false;

    if (ts.isTypeReferenceNode(node)) {
        if (config.forceToParseTypes.includes(node.typeName.getText())) return true;
    }

    const symbol = symbolAtNode(node);
    if (symbol) {
        if (config.forceToParseTypes.includes(symbol.name)) return true;
    }

    const localSymbol = localSymbolAtNode(node);
    if (localSymbol) {
        if (config.forceToParseTypes.includes(localSymbol.name)) return true;
    }

    return false;
};

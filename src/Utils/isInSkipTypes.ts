import * as ts from "typescript";
import { Config } from "../../src/Config";
import { symbolAtNode, localSymbolAtNode } from "./symbolAtNode";

export const isInSkipTypes = (node: ts.Node, config: Config) => {
    if (!config.skipTypes || !config.skipTypes.length) return false;

    const symbol = symbolAtNode(node);
    if (symbol) {
        if (config.skipTypes.includes(symbol.name)) return true;
    }

    const localSymbol = localSymbolAtNode(node);
    if (localSymbol) {
        if (config.skipTypes.includes(localSymbol.name)) return true;
    }

    return false;
};

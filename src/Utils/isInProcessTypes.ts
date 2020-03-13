import * as ts from "typescript";
import { Config } from "../../src/Config";
import { symbolAtNode, localSymbolAtNode } from "./symbolAtNode";

export const isInProcessTypes = (node: ts.Node, config: Config) => {
    if (!config.processTypes || !config.processTypes.length) return false;

    const symbol = symbolAtNode(node);
    if (symbol) {
        if (config.processTypes.includes(symbol.name)) return true;
    }

    const localSymbol = localSymbolAtNode(node);
    if (localSymbol) {
        if (config.processTypes.includes(localSymbol.name)) return true;
    }

    return false;
};

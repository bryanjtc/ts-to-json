import * as ts from "typescript";
import { Config } from "../../src/Config";
import { getNodeName } from "./node-name";

export const isInSkipTypes = (node: ts.Node, config: Config) => {
    if (!config.skipParseTypes || !config.skipParseTypes.length) return false;

    const name = getNodeName(node);

    if (name) {
        if (config.skipParseTypes.includes(name)) return true;
    }

    // const symbol = symbolAtNode(node);
    // if (symbol) {
    //     if (config.skipParseTypes.includes(symbol.name)) return true;
    // }

    // const localSymbol = localSymbolAtNode(node);
    // if (localSymbol) {
    //     if (config.skipParseTypes.includes(localSymbol.name)) return true;
    // }

    // if (config.skipParseTypes.includes(node.getFullText().trim())) return true;
    // if (config.skipParseTypes.includes(node.getText().trim())) return true;

    return false;
};

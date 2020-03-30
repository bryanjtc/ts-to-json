import * as ts from "typescript";
import { Config } from "../../src/Config";
// import { symbolAtNode, localSymbolAtNode } from "./symbolAtNode";
// import { getNodeName } from "./node-name";

export const isInSkipParseFiles = (node: ts.Node, config: Config) => {
    if (!config.skipParseTypeInFiles || !config.skipParseTypeInFiles.length) return false;

    const file = node.getSourceFile().fileName;

    if (config.skipParseTypeInFiles.find((x) => file.includes(x))) {
        return true;
    }

    return false;
};

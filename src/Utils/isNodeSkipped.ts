import * as ts from "typescript";
import { Config } from "../../src/Config";
import { isInForceParseTypes } from ".";

export const isNodeSkipped = (node: ts.Node, config: Config) => {
    const { shouldParseNode, skipParseTypeInFiles } = config;

    if (isInForceParseTypes(node, config)) return false;

    if (!shouldParseNode && !skipParseTypeInFiles) return false;

    if (shouldParseNode) {
        if (!shouldParseNode(node)) {
            return true;
        }
    }

    const file = node.getSourceFile().fileName;
    if (!skipParseTypeInFiles || !skipParseTypeInFiles.length) return false;

    if (skipParseTypeInFiles.find((x) => file.includes(x))) {
        return true;
    }

    return false;
};

import * as ts from "typescript";
import { Config } from "../../src/Config";
import { isInForceParseTypes } from ".";

export const shouldParseNode = (node: ts.Node, config: Config) => {
    const { shouldParseNode: shouldParseNodeProp, skipParseTypeInFiles } = config;

    if (isInForceParseTypes(node, config)) return true;

    if (shouldParseNodeProp) {
        if (!shouldParseNodeProp(node)) return false;
    }

    if (skipParseTypeInFiles) {
        if (skipParseTypeInFiles.find((x) => node.getSourceFile().fileName.includes(x))) {
            return false;
        }
    }

    return true;
};

import ts from "typescript";
import { Config } from "../../src/Config";
import { isInForceParseTypes } from ".";

export const shouldParseNode = (node: ts.Node, config: Config) => {
    const { shouldParseNode: shouldParseNodeProp, skipParseFiles } = config;

    if (isInForceParseTypes(node, config)) return true;

    if (shouldParseNodeProp) {
        if (!shouldParseNodeProp(node)) return false;
    }

    if (skipParseFiles) {
        if (skipParseFiles.find((x) => node.getSourceFile().fileName.includes(x))) {
            return false;
        }
    }

    return true;
};

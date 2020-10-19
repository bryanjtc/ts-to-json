import * as ts from "typescript";
import { Config } from "../../src/Config";
import { getNodeName } from "./node-name";
import { isFunctionKind } from "./isFunctionKind";

export const isInSkipTypes = (node: ts.Node, config: Config) => {
    if (!config.skipParseTypes || !config.skipParseTypes.length) return false;

    const name = getNodeName(node);

    if (name) {
        if (config.skipParseTypes.includes(name)) return true;
    }

    if (config.skipParseTypes.includes("function") && isFunctionKind(node)) {
        return true;
    }

    return false;
};

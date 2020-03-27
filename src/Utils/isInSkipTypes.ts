import * as ts from "typescript";
import { Config } from "../../src/Config";
import { getNodeName } from "./node-name";

export const isInSkipTypes = (node: ts.Node, config: Config) => {
    if (!config.skipParseTypes || !config.skipParseTypes.length) return false;

    const name = getNodeName(node);

    if (name) {
        if (config.skipParseTypes.includes(name)) return true;
    }

    return false;
};

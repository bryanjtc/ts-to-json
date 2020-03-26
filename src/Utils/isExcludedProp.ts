import * as ts from "typescript";
import { Config } from "../Config";
import { getPropsRecursively } from "../Utils";
import { Context } from "../NodeParser";
import { LiteralType } from "../Type/LiteralType";

export const isExcludedProp = (node: ts.Node | LiteralType, context: Context, config: Config) => {
    if (!config.excludeProperties || !config.excludeProperties.length) return false;

    const props = getPropsRecursively(node, context);
    if (!props) return false;

    const path = props?.join(".");

    if (!path || !config.excludeProperties.includes(path)) {
        return false;
    }
    return true;
};

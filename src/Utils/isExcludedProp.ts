/* eslint-disable @typescript-eslint/prefer-for-of */
import * as ts from "typescript";
import { Config } from "../Config";
import { getPropsRecursively, hasLimitOptions } from "../Utils";
import { Context } from "../NodeParser";
import { LiteralType } from "../Type/LiteralType";

export const isExcludedProp = (node: ts.Node | LiteralType, context: Context, config: Config) => {
    if (!hasLimitOptions(config)) return false;
    const props = getPropsRecursively(node, context);
    if (!props || !props.length) return false;

    const chained = props?.join(".");

    if (config.includeProperties && config.includeProperties.length) {
        for (let i = 0; i < config.includeProperties.length; i++) {
            const includeProps = config.includeProperties[i];
            if (includeProps.startsWith(chained)) {
                return false;
            }
            if (chained.startsWith(includeProps)) {
                return false;
            }
        }
        return true;
    }

    if (config.excludeProperties && config.excludeProperties.length) {
        if (!config.excludeProperties.includes(chained)) {
            return false;
        }
    }

    return true;
};

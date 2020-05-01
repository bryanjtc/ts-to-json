/* eslint-disable @typescript-eslint/prefer-for-of */
import * as ts from "typescript";
import { Config } from "../Config";
import { getPropsRecursively, hasLimitOptions, getAnyNodeName } from "../Utils";
import { Context } from "../NodeParser";
import { LiteralType } from "../Type/LiteralType";

const arrayStartWith = (src: string[], des: string[]) => {
    for (let i = 0; i < src.length; i++) {
        const item = src[i];
        const desItem = des[i];
        if (!desItem) break;
        if (item !== desItem) return false;
    }
    return true;
};

export const isExcludedProp = (node: ts.Node | LiteralType, context: Context, config: Config) => {
    if (!hasLimitOptions(config)) return false;

    if (config.excludeProps && config.excludeProps.length) {
        const name = getAnyNodeName(node);
        if (name && config.excludeProps.includes(name)) {
            return true;
        }
    }

    const props = getPropsRecursively(node, context);
    if (!props || !props.length) return false;

    const chained = props?.join(".");

    const isMaxDepth = config.maxDepth && props.length > config.maxDepth;

    if (config.includeProps && config.includeProps.length) {
        for (let i = 0; i < config.includeProps.length; i++) {
            const includeProp = config.includeProps[i];
            const includePropArr = includeProp.split(".");
            if (!isMaxDepth && (arrayStartWith(includePropArr, props) || arrayStartWith(props, includePropArr))) {
                return false;
            }
        }
    } else if (config.excludeRootProps && config.excludeRootProps.length) {
        if (!isMaxDepth && !config.excludeRootProps.includes(chained)) {
            return false;
        }
    } else {
        if (!isMaxDepth) return false;
    }

    return true;
};

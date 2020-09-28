/* eslint-disable @typescript-eslint/prefer-for-of */
import * as ts from "typescript";
import { Config } from "../Config";
import { getPropsRecursively, hasLimitOptions, getAnyNodeName, isMemberOfFunctionParameter } from "../Utils";
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

const isMaxDepth = (props: string[], maxDepth?: number) => {
    if (!maxDepth) return false;
    return maxDepth && props.length > maxDepth;
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

    if (isMemberOfFunctionParameter(node, context)) {
        if (isMaxDepth(props, config.funcParamMaxDepth)) return true;
        return false;
    }

    const chained = props?.join(".");

    const rootMaxDeptReached = isMaxDepth(props, config.maxDepth);

    if (config.includeProps && config.includeProps.length) {
        for (let i = 0; i < config.includeProps.length; i++) {
            const includeProp = config.includeProps[i];
            const includePropArr = includeProp.split(".");
            if (
                !rootMaxDeptReached &&
                (arrayStartWith(includePropArr, props) || arrayStartWith(props, includePropArr))
            ) {
                return false;
            }
        }
    } else if (!rootMaxDeptReached && config.excludeRootProps && config.excludeRootProps.length) {
        if (!config.excludeRootProps.includes(chained)) {
            return false;
        }
    } else {
        if (!rootMaxDeptReached) return false;
    }

    return true;
};

import { Context } from "../NodeParser";
import * as ts from "typescript";
import { hasLimitOptions, getTypeReferenceNodeName, getNodeName } from ".";
import { Config } from "../Config";

export const shouldExtendKey = (context: Context, config: Config) => {
    if (!hasLimitOptions(config)) return false;
    if (!context.hasParentContext() || !context.getParentContext()?.getReference()) return false;
    return true;
};

export const extendKey = (
    key: string,
    node: ts.Node,
    context: Context,
    config: Config,
    ignoredIfSameAsConfigTypeName?: boolean
) => {
    const sameAsConfigType = ignoredIfSameAsConfigTypeName && getNodeName(node) !== config.type ? false : true;
    if (!shouldExtendKey(context, config) || !sameAsConfigType) return key;
    const ref = context.getReference();
    if (!ref) return key;
    const refTypeName = getTypeReferenceNodeName(ref);
    if (!refTypeName) return key;
    return `${key}-${refTypeName}`;
};

import { Context } from "../NodeParser";
import * as ts from "typescript";
import { hasLimitOptions, getTypeReferenceNodeName } from ".";
import { Config } from "../Config";

export const shouldExtendKey = (context: Context, config: Config) => {
    if (!hasLimitOptions(config)) return false;
    if (!context.hasParentContext() || !context.getParentContext()?.getReference()) return false;
    return true;
};

export const extendKey = (key: string, _node: ts.Node, context: Context, config: Config, ignored?: boolean) => {
    if (!shouldExtendKey(context, config) || ignored) return key;
    const ref = context.getReference();
    if (!ref) return key;
    const refTypeName = getTypeReferenceNodeName(ref);
    if (!refTypeName) return key;
    return `${key}-${refTypeName}`;
};

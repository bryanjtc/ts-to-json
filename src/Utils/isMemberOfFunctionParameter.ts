import * as ts from "typescript";
import { LiteralType } from "../Type/LiteralType";
import { Context } from "../NodeParser";

function isMember(node: ts.Node): boolean {
    if (ts.isParameter(node)) return true;

    if (node.parent) {
        return isMember(node.parent);
    }

    return false;
}

export function isParameterOrMemberOfParameter(context: Context): boolean {
    if (context.isParameter) return true;
    const parentContext = context.getParentContext();
    if (parentContext) {
        return isParameterOrMemberOfParameter(parentContext);
    }
    return false;
}

export const isMemberOfFunctionParameter = (node: ts.Node | LiteralType, context: Context): boolean => {
    if (!node || node instanceof LiteralType) return false;

    if (isMember(node)) return true;

    if (isParameterOrMemberOfParameter(context)) return true;

    const ref = context.getReference();

    if (ref && isMember(ref)) return true;

    return false;
};

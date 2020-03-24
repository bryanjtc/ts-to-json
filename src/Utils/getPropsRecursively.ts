import { Context } from "../NodeParser";
import { getPropsFromContextRecursively, getPropName, getPropsFromTypeLiteralRecursively } from ".";
import * as ts from "typescript";

export const getPropsRecursively = (node: ts.Node, context: Context) => {
    let propName: string | undefined = undefined;
    if (ts.isLiteralTypeNode(node)) {
        propName = (node.literal as any).text;
    } else {
        propName = getPropName(node);
    }
    // if (!propName) return;

    let props: string[] = [];
    const props2 = getPropsFromContextRecursively(context);

    if (!context.hasOperator("typeof") && [ts.SyntaxKind.TypeLiteral].includes(node.parent.kind)) {
        props = getPropsFromTypeLiteralRecursively(node.parent);
    }
    props = [...props2, ...props];
    if (propName) props?.push(propName);
    return props;
};

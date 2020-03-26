import { Context } from "../NodeParser";
import { getPropsFromParentContextRecursively, getPropName, getPropsFromTypeLiteralRecursively, getNodeName } from ".";
import * as ts from "typescript";
import { LiteralType } from "../Type/LiteralType";

export const getPropsRecursively = (node: ts.Node | LiteralType, context: Context) => {
    let propName: string | undefined = undefined;

    if (node instanceof LiteralType) {
        propName = node
            .getName()
            .split('"')
            .join("");
    } else if (ts.isLiteralTypeNode(node)) {
        propName = (node.literal as any).text;
    } else if (ts.isEnumMember(node)) {
        propName = getNodeName(node);
    } else {
        propName = getPropName(node);
    }
    let props: string[];
    if (
        node instanceof LiteralType ||
        (ts.isInterfaceDeclaration(node.parent) && !context.hasParentContextRecreance())
    ) {
        props = getPropsFromTypeLiteralRecursively(context.getReference());
    } else {
        props = ts.isEnumMember(node) ? [] : getPropsFromParentContextRecursively(context);

        if (
            !context.hasOperator("typeof") &&
            [ts.SyntaxKind.TypeLiteral, ts.SyntaxKind.EnumDeclaration].includes(node.parent.kind)
        ) {
            const parentNode = ts.isEnumMember(node) ? context.getReference() : node.parent;
            if (parentNode) {
                const nodeParentProps = getPropsFromTypeLiteralRecursively(parentNode);
                props = [...props, ...nodeParentProps];
            }
        }
    }
    if (propName) props?.push(propName);
    return props;
};

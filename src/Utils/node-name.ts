import * as ts from "typescript";
import { localSymbolAtNode, symbolAtNode } from "./symbolAtNode";
import { LiteralType } from "../Type/LiteralType";
import { getPropName } from "./getPropName";

export const getNodeName = (node?: ts.Node): string | undefined => {
    if (!node) return;
    const symbol = symbolAtNode(node);
    if (symbol) return symbol?.name;
    const symbolLocale = localSymbolAtNode(node);
    if (symbolLocale) return symbolLocale.name;
    if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
        return node.typeName.escapedText as string;
    }
    return node.getText();
};

export const getAnyNodeName = (node?: ts.Node | LiteralType): string | undefined => {
    if (!node) return;

    if (node instanceof LiteralType) {
        return node.getName().split('"').join("");
    } else if (ts.isLiteralTypeNode(node)) {
        return (node.literal as any).text;
    } else if (ts.isEnumMember(node) || ts.isTypeReferenceNode(node)) {
        return getNodeName(node);
    }
    return getPropName(node);
};

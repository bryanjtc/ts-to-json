import { getPropName, isTopLevelDeclarations } from ".";
import * as ts from "typescript";

export function getPropsFromTypeLiteralRecursively(node?: ts.Node, props: string[] = []): string[] {
    if (!node) return props;
    if (node.parent) {
        getPropsFromTypeLiteralRecursively(node.parent, props);
    }
    if (!ts.isPropertySignature(node)) return props;
    if (isTopLevelDeclarations(node)) return props;

    const propName = getPropName(node);
    if (propName) props.push(propName);

    return props;
}

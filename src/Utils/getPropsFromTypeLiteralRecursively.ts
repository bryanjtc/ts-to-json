import { getPropName, isTopLevelDeclarations } from ".";
import * as ts from "typescript";

export function getPropsFromTypeLiteralRecursively(node?: ts.Node, skipNode?: ts.Node, props: string[] = []): string[] {
    if (!node) return props;
    if (skipNode && node === skipNode) return props;
    if (node.parent) {
        getPropsFromTypeLiteralRecursively(node.parent, skipNode, props);
    }
    if (!ts.isPropertySignature(node)) return props;
    if (isTopLevelDeclarations(node)) return props;

    const propName = getPropName(node);
    if (propName) props.push(propName);

    return props;
}

import * as ts from "typescript";

export const getNodeInfo = (node: ts.Node) => {
    const infos: string[] = [];
    infos.push(`\ntext=${node.getText().trim()}`);
    infos.push(`fullText=${node.getFullText().trim()}`);
    infos.push(`kind=${node.kind}`);
    infos.push(`source file=${node.getSourceFile().fileName}:${node.parent.getStart()}`);
    infos.push(`parent=${node.parent.getFullText().trim()}`);
    infos.push(`parent sourceFile=${node.parent.getSourceFile().fileName}:${node.parent.getStart()}`);
    return infos.join("\n");
};

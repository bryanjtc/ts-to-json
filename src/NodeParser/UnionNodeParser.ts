import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { UnionType } from "../Type/UnionType";
import { BaseType } from "../Type/BaseType";
import { notUndefined } from "../Utils/notUndefined";
import { Config } from "../Config";
import { isExcludedProp } from "../Utils/isExcludedProp";

export class UnionNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser,
        private config: Config
    ) {}

    public supportsNode(node: ts.UnionTypeNode): boolean {
        return node.kind === ts.SyntaxKind.UnionType;
    }

    public createType(node: ts.UnionTypeNode, context: Context): BaseType | undefined {
        const types = node.types
            .filter((x) => !isExcludedProp(x, context, this.config))
            .map((subnode) => {
                return this.childNodeParser.createType(subnode, context);
            })
            .filter(notUndefined);

        if (types.length === 1) {
            return types[0];
        } else if (types.length === 0) {
            return undefined;
        }

        return new UnionType(types);
    }
}

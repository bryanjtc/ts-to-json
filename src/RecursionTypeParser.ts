import * as ts from "typescript";
import { Context, NodeParser } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
import { ReferenceType } from "./Type/ReferenceType";
import { getClosestTopLevelDeclarationName, getTypeReferenceNodeName, hasLimitOptions } from "./Utils";
import { Config } from "../src/Config";
import { TypeReferenceNodeParser } from "./NodeParser/TypeReferenceNodeParser";
// import {} from './CircularReferenceNodeParser';

// const isDirectChildOfTopLevelType  = (node:ts.Node)=>{
//     if(!isTopLevelDeclarations(node.parent))return trie
// };

export class RecursionTypeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private chainNodeParser: NodeParser,
        private config: Config
    ) {}

    public supportsNode(node: ts.Node, context: Context): boolean {
        if (node.kind !== ts.SyntaxKind.TypeReference || !hasLimitOptions(this.config) || !this.config.type)
            return false;
        const typeName = getTypeReferenceNodeName(node);

        // const ref = context.getReference();
        // // const nodeTopLevelName = getClosestTopLevelDeclarationName(node);
        const refTopLevelName = getClosestTopLevelDeclarationName(node);
        // if (refTopLevelName === this.config.type && typeName === this.config.type) {
        //     return true;
        // }

        if (typeName === this.config.type && refTopLevelName === this.config.type) {
            return true;
        }

        return false;
    }

    public createType(node: ts.TypeReferenceNode, context: Context, reference?: ReferenceType): BaseType | undefined {
        // const typeSymbol: any = this.typeChecker.getSymbolAtLocation(node.typeName);

        // if (typeSymbol === undefined) {
        //     return undefined;
        // }

        const parser = new TypeReferenceNodeParser(this.typeChecker, this.chainNodeParser, this.config);
        const type = parser.createType(node, new Context(node, context));
        // const excluded = isExcludedProp(node, context, this.config);

        // if (!this.isExportNode(node)) {
        //     // if (isTopLevelDeclarations(node.parent) || [ts.SyntaxKind.TypeLiteral].includes(node.kind))

        //     // if (!isChildOfTopLevelType(node, this.config.type))
        //     // if ([ts.SyntaxKind.TypeLiteral].includes(node.kind)) {
        //     return baseType;
        //     // }
        // }

        return type;
    }
}

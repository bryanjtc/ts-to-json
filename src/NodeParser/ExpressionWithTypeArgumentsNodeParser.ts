import ts from "typescript";
import { Config } from "../Config";
import { UnknownTypeReference } from "../Error/UnknownTypeReference";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { UnknownSymbolType } from "../Type/UnknownSymbolType";

export class ExpressionWithTypeArgumentsNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser,
        private config: Config
    ) {}

    public supportsNode(node: ts.ExpressionWithTypeArguments): boolean {
        return node.kind === ts.SyntaxKind.ExpressionWithTypeArguments;
    }
    public createType(node: ts.ExpressionWithTypeArguments, context: Context): BaseType | undefined {
        const typeSymbol = this.typeChecker.getSymbolAtLocation(node.expression)!;
        if (typeSymbol.flags & ts.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            if (aliasedSymbol.name === "unknown") {
                if (this.config.handleUnknownTypes) return new UnknownSymbolType(node, aliasedSymbol);
                throw new UnknownTypeReference(node);
            }
            return this.childNodeParser.createType(
                aliasedSymbol.declarations![0],
                this.createSubContext(node, context)
            );
        } else if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name);
        } else if (typeSymbol.declarations) {
            return this.childNodeParser.createType(typeSymbol.declarations![0], this.createSubContext(node, context));
        }
        return;
    }

    protected createSubContext(node: ts.ExpressionWithTypeArguments, parentContext: Context): Context {
        const subContext = new Context(node, parentContext);
        if (node.typeArguments?.length) {
            node.typeArguments.forEach((typeArg) => {
                const type = this.childNodeParser.createType(typeArg, parentContext);
                subContext.pushArgument(type);
            });
        }
        return subContext;
    }
}

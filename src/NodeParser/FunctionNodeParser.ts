import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { FunctionParameter, FunctionType } from "../Type/FunctionType";
import { isNodeHidden, symbolAtNode, isFunctionKind } from "../Utils";
import { UnknownSymbolType } from "../Type/UnknownSymbolType";
import { Config } from "../Config";

/**
 * A function node parser that creates a function type so that mapped types can
 * use functions as values. There is no formatter for function types.
 */
export class FunctionNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser,
        private config: Config
    ) {}

    public supportsNode(node: ts.FunctionTypeNode | ts.FunctionDeclaration | ts.MethodSignature): boolean {
        return isFunctionKind(node);
    }

    private pushParameters(node: ts.FunctionDeclaration, context: Context) {
        if (node.typeParameters && node.typeParameters.length) {
            node.typeParameters.forEach((typeParam) => {
                const nameSymbol = this.typeChecker.getSymbolAtLocation(typeParam.name)!;
                context.pushParameter(nameSymbol.name);

                let type;

                if (typeParam.default) {
                    type = this.childNodeParser.createType(typeParam.default, context);
                }

                if (!type) {
                    type = new UnknownSymbolType(node, nameSymbol, this.config.allowArbitraryDataTypes);
                }
                context.setDefault(nameSymbol.name, type);
            });
        }
    }

    public createType(node: ts.FunctionDeclaration, context: Context): BaseType {
        this.pushParameters(node, context);

        return new FunctionType(
            this.getTypeId(node, context),
            [],
            this.getParameters(node, context),
            this.getAdditionalParameters(node, context),
            this.childNodeParser.createType(node.type!, context)!
        );
    }

    private getParameters(node: ts.FunctionDeclaration, context: Context): FunctionParameter[] {
        return node.parameters.filter(ts.isParameter).reduce((result: FunctionParameter[], parameterNode) => {
            const parameterSymbol = symbolAtNode(parameterNode);
            if (!parameterSymbol) return result;
            if (isNodeHidden(parameterNode)) {
                return result;
            }
            const newContext = new Context(parameterNode);
            this.pushParameters(node, newContext);
            newContext.isParameter = true;
            const objectParameter: FunctionParameter = new FunctionParameter(
                parameterSymbol.getName(),
                this.childNodeParser.createType(parameterNode.type!, newContext)!,
                !parameterNode.questionToken
            );

            result.push(objectParameter);
            return result;
        }, []);
    }
    private getAdditionalParameters(node: ts.FunctionDeclaration, context: Context): BaseType | false {
        const indexSignature = node.parameters.find(ts.isIndexSignatureDeclaration);
        if (!indexSignature) {
            return false;
        }

        return this.childNodeParser.createType(indexSignature.type!, context)!;
    }

    private getTypeId(node: ts.Node, context: Context): string {
        const fullName = `function-${node.getFullStart()}`;

        const argumentIds = context.getArguments().map((arg) => arg!.getId());

        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}

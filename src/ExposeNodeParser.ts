import * as ts from "typescript";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
import { DefinitionType } from "./Type/DefinitionType";
import { ReferenceType } from "./Type/ReferenceType";
import { symbolAtNode, getNodeName, shouldExtendKey } from "./Utils";
import { Config } from "../src/Config";

export class ExposeNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private subNodeParser: SubNodeParser,
        private config: Config
    ) {}

    public supportsNode(node: ts.Node): boolean {
        return this.subNodeParser.supportsNode(node);
    }

    public createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType | undefined {
        const baseType = this.subNodeParser.createType(node, context, reference);

        if (baseType === undefined) {
            return undefined;
        }

        if (!this.isExportNode(node)) {
            return baseType;
        }

        return new DefinitionType(this.getDefinitionName(node, context), baseType);
    }

    private isExportNode(node: ts.Node): boolean {
        if (this.config.expose === "all") {
            return node.kind !== ts.SyntaxKind.TypeLiteral;
        } else if (this.config.expose === "none") {
            const nodeName = getNodeName(node);
            if (!this.config.type || nodeName !== this.config.type) {
                return false;
            }
        }

        const localSymbol: ts.Symbol = (node as any).localSymbol;
        return localSymbol ? "exportSymbol" in localSymbol : false;
    }
    private getDefinitionName(node: ts.Node, context: Context): string {
        const symbol = symbolAtNode(node)!;

        let fullName = this.typeChecker.getFullyQualifiedName(symbol).replace(/^".*"\./, "");

        /*
            added '___' to identify original type,
            it should contain all the property regardless of restriction options like skipParseRootPropTypes and skipParsePropTypes.
        */
        if (shouldExtendKey(context, this.config)) {
            fullName = "___" + fullName;
        }

        const argumentIds = context.getArguments().map((arg) => arg?.getName());

        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}

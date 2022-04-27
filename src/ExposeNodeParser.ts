import ts from "typescript";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
import { DefinitionType } from "./Type/DefinitionType";
import { ReferenceType } from "./Type/ReferenceType";
import { getNodeName, shouldExtendKey } from "./Utils";
import { hasJsDocTag } from "./Utils/hasJsDocTag";
import { symbolAtNode } from "./Utils/symbolAtNode";
import { Config } from "../src/Config";

export class ExposeNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected subNodeParser: SubNodeParser,
        protected expose: "all" | "none" | "export",
        protected jsDoc: "none" | "extended" | "basic",
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

    protected isExportNode(node: ts.Node): boolean {
        if (this.expose === "all") {
            return node.kind !== ts.SyntaxKind.TypeLiteral;
        } else if (this.expose === "none") {
            const nodeName = getNodeName(node);
            if (!this.config.type || nodeName !== this.config.type) {
                return false;
            }
        } else if (this.jsDoc !== "none" && hasJsDocTag(node, "internal")) {
            return false;
        }

        const localSymbol: ts.Symbol = (node as any).localSymbol;
        return localSymbol ? "exportSymbol" in localSymbol : false;
    }

    protected getDefinitionName(node: ts.Node, context: Context): string {
        const symbol = symbolAtNode(node)!;

        let fullName = this.typeChecker.getFullyQualifiedName(symbol).replace(/^".*"\./, "");

        /*
            added '___' to identify original type,
            it should contain all the property regardless of restriction options like excludeRootProps.
        */
        if (shouldExtendKey(context, this.config)) {
            fullName = "___" + fullName;
        }

        const argumentIds = context.getArguments().map((arg) => arg?.getName());

        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}

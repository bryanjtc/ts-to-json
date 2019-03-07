import * as ts from "typescript";
import { Context, NodeParser } from "./NodeParser";
import { BaseType } from "./Type/BaseType";
import { DefinitionType } from "./Type/DefinitionType";

export class TopRefNodeParser implements NodeParser {
    public constructor(
        private childNodeParser: NodeParser,
        private fullName: string,
        private topRef: boolean,
    ) {
    }
    // hack to change the fullName by 'createSchemaByNodeKind' for parsing multiple node
    // other option would be adding a 'fullName' field to BaseType
    public setFullName(fullName: string) {
        this.fullName = fullName;
    }

    public createType(node: ts.Node, context: Context): BaseType {
        const baseType = this.childNodeParser.createType(node, context);
        if (this.topRef && !(baseType instanceof DefinitionType)) {
            return new DefinitionType(this.fullName, baseType);
        } else if (!this.topRef && (baseType instanceof DefinitionType)) {
            return baseType.getType();
        } else {
            return baseType;
        }
    }
}

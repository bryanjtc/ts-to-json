import * as ts from "typescript";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
import { ReferenceType } from "./Type/ReferenceType";
import { getKey, isInSkipParseFiles, isInForceParseTypes } from "./Utils";
import { Config } from "../src/Config";

export class CircularReferenceNodeParser implements SubNodeParser {
    private circular = new Map<string, BaseType>();

    public constructor(private childNodeParser: SubNodeParser, private config: Config) {}

    public supportsNode(node: ts.Node): boolean {
        if (isInSkipParseFiles(node, this.config)) {
            if (!isInForceParseTypes(node, this.config)) {
                return false;
            }
        }

        return this.childNodeParser.supportsNode(node);
    }
    public createType(node: ts.Node, context: Context): BaseType | undefined {
        const key = getKey(node, context);
        if (this.circular.has(key)) {
            return this.circular.get(key)!;
        }

        const reference = new ReferenceType();

        // https://github.com/vega/ts-json-schema-generator/issues/357
        reference.setId("circularRef-" + key);

        this.circular.set(key, reference);
        const type = this.childNodeParser.createType(node, context, reference);
        if (type) {
            reference.setType(type);
        }
        this.circular.delete(key);

        return type;
    }
}

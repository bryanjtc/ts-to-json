import * as ts from "typescript";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
import { ReferenceType } from "./Type/ReferenceType";
import { getKey, isNodeSkipped, isInForceParseTypes, extendKey, isRecursionToType, hasLimitOptions } from "./Utils";
import { Config } from "../src/Config";

export class CircularReferenceNodeParser implements SubNodeParser {
    private circular = new Map<string, BaseType>();

    public constructor(private childNodeParser: SubNodeParser, private config: Config) {}

    public supportsNode(node: ts.Node): boolean {
        if (isNodeSkipped(node, this.config)) {
            if (!isInForceParseTypes(node, this.config)) {
                return false;
            }
        }

        return this.childNodeParser.supportsNode(node);
    }

    public createType(node: ts.Node, context: Context): BaseType | undefined {
        const key = extendKey(getKey(node, context), node, context, this.config);
        context.ignoreLimits = hasLimitOptions(this.config) && isRecursionToType(node, context, this.config.type);

        if (this.circular.has(key)) {
            context.ignoreLimits = false;
            return this.circular.get(key)!;
        }

        const reference = new ReferenceType();

        // https://github.com/vega/ts-json-schema-generator/issues/357
        reference.setId("circularRef-" + key);

        this.circular.set(key, reference);
        const type = this.childNodeParser.createType(node, context, reference);
        context.ignoreLimits = false;
        if (type) {
            reference.setType(type);
        }
        this.circular.delete(key);

        return type;
    }
}

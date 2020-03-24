import * as ts from "typescript";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
import { ReferenceType } from "./Type/ReferenceType";
import {
    getKey,
    isInSkipParseFiles,
    isInForceParseTypes,
    getNodeName,
    ignoreLimits,
    getPropsRecursively,
    getPropsFromContextRecursively,
    getClosestTopLevelDeclarationName,
    isChildOfTypeReference,
    extendKey,
} from "./Utils";
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    public createType(node: ts.Node, context: Context, recursive?: boolean): BaseType | undefined {
        const ignored = ignoreLimits(context);
        const ref = context.getReference();
        const sameAsConfigType = getNodeName(node) === this.config.type;

        const nodeTopLevelName = getClosestTopLevelDeclarationName(node);

        const refTopLevelName = ref && getClosestTopLevelDeclarationName(ref.parent);

        const isRecursive = nodeTopLevelName === refTopLevelName;
        const isChildOfType = isChildOfTypeReference(context, this.config.type) && sameAsConfigType;
        if (!ignored) context.ignoreLimits = isChildOfType;

        const parProps = getPropsFromContextRecursively(context);

        const props = !sameAsConfigType && !ignored && ref ? getPropsRecursively(node, context) : [];
        const propPath =
            props.length &&
            this.config.excludeProperties &&
            this.config.excludeProperties.find(x => x.startsWith(props.join(".")))
                ? props.join(".")
                : "";

        const orgKey = getKey(node, context);

        // const key =
        //     extendKey(orgKey, node, context, this.config, ignored) +
        //     propPath +
        //     (recursive === false ? "-1" : "") +
        //     (ignored ? "-original" : "");
        const key =
            extendKey(orgKey, node, context, this.config) +
            // orgKey +
            (propPath ? "-" + propPath : "") +
            (recursive === false ? "-1" : "") +
            // (isChildOfType ? "-same" : "") +
            (ignored ? "-original" : "");

        const reference = new ReferenceType();

        if (this.circular.has(key)) {
            return this.circular.get(key)!;
        }

        if (
            // isRecursive &&
            !sameAsConfigType &&
            ts.isInterfaceDeclaration(node) &&
            !recursive &&
            !this.circular.has(key)
        ) {
            const newContext = new Context();
            newContext.ignoreLimits = true;
            this.createType(node, newContext, true);
            newContext.ignoreLimits = false;
            context.ignoreLimits = false;
            const orgType = this.circular.get(orgKey + "-original");
            // this.circular.delete(key);
            return orgType;
        }

        // https://github.com/vega/ts-json-schema-generator/issues/357
        reference.setId("circularRef-" + key);
        this.circular.set(key, reference);
        const type = this.childNodeParser.createType(node, context, reference);
        context.ignoreLimits = false;
        if (type) {
            reference.setType(type);
        }
        if (!ignored) this.circular.delete(key);

        return type;
    }
}

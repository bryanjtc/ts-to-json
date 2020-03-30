import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { UnknownType } from "../Type/UnknownType";
import { StaticType } from "../Type/StaticType";
import { Config } from "../../src/Config";
import { getNodeName, isInSkippedFile } from "../Utils";

/*
    To skip processing type in a file expansive types like HTMLElement
    instead will return type name e.g. HTMLElement
*/

export class SkippedFileTypeParser implements SubNodeParser {
    constructor(private config: Config) {}
    public supportsNode(node: ts.Node): boolean {
        if (isInSkippedFile(node, this.config)) {
            return true;
        }
        return false;
    }
    public createType(node: ts.Node, context: Context): BaseType {
        const name = getNodeName(node);
        if (name) return new StaticType(name);
        return new UnknownType();
    }
}

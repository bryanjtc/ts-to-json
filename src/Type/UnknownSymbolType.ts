import { BaseType } from "./BaseType";
import { getAnyNodeName } from "../Utils";
import * as ts from "typescript";

export class UnknownSymbolType extends BaseType {
    private name: string;
    constructor(parentNode: ts.Node, node: ts.Symbol) {
        super();
        let name: string | undefined = node.getName();
        if (name === "unknown") {
            name = getAnyNodeName(parentNode);
        }
        this.name = name || "unknown";
    }
    public getId(): string {
        return "unknown";
    }
    public getName(): string {
        return this.name;
    }
}

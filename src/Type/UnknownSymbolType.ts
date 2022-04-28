import { BaseType } from "./BaseType";
import { getAnyNodeName } from "../Utils";
import * as ts from "typescript";

export class UnknownSymbolType extends BaseType {
    private name: string;
    constructor(parentNode: ts.Node, symbol: ts.Symbol, useSymbolName = false) {
        super();
        if (!useSymbolName) {
            this.name = "unknown";
            return;
        }
        let name: string | undefined = symbol.getName();
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

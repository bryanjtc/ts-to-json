import ts from "typescript";
import { BaseError } from "./BaseError";
import { getNodeInfo } from "./utils";

export class UnknownNodeError extends BaseError {
    public constructor(private node: ts.Node, private reference?: ts.Node) {
        super(`Unknown node "${node.getFullText()}: ${getNodeInfo(node)}`);
    }

    public getNode(): ts.Node {
        return this.node;
    }

    public getReference(): ts.Node | undefined {
        return this.reference;
    }
}

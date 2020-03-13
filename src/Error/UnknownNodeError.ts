import * as ts from "typescript";
import { BaseError } from "./BaseError";

export class UnknownNodeError extends BaseError {
    public constructor(private node: ts.Node, private reference?: ts.Node) {
        super(
            `Unknown node "${node.getFullText()}"\n kind=${node.kind}\nsource file=${
                node.getSourceFile().fileName
            }:${node.getStart()}\nparent=${node.parent.getFullText().trim()}\nparent sourceFile=${
                node.parent.getSourceFile().fileName
            }:${node.parent.getStart()}\n to suppress this error set handleUnknownTypes option to true.
            `
        );
    }

    public getNode(): ts.Node {
        return this.node;
    }

    public getReference(): ts.Node | undefined {
        return this.reference;
    }
}

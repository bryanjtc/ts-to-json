import { BaseError } from "./BaseError";
import * as ts from "typescript";
import { getNodeInfo } from "./utils";

export class LogicError extends BaseError {
    public constructor(private msg: string, node?: ts.Node) {
        super(msg + getNodeInfo(node));
    }
}

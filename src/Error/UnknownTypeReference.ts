import { BaseError } from "./BaseError";
import * as ts from "typescript";
import { getNodeInfo } from "./utils";

export class UnknownTypeReference extends BaseError {
    public constructor(private type: ts.TypeReferenceNode | undefined, message = "") {
        super(
            `Unknown type reference "${type ? type.getFullText().trim() : undefined}"${
                message && message && ", " + message
            }${getNodeInfo(type)}`
        );
    }

    public getType(): ts.TypeReferenceNode | undefined {
        return this.type;
    }
}

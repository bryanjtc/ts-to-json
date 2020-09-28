import * as ts from "typescript";
import { LiteralType } from "../Type/LiteralType";

export const isLiteralType = (node: ts.Node | LiteralType) => {
    return node instanceof LiteralType;
};

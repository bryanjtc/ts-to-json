import * as ts from "typescript";
import { Config } from "../../src/Config";

export const isInSkippedFile = (node: ts.Node, config: Config) => {
    const { shouldSkipFileTypes, skipParseTypeInFiles } = config;

    if (!shouldSkipFileTypes && !skipParseTypeInFiles) return false;

    const file = node.getSourceFile().fileName;

    if (shouldSkipFileTypes) {
        if (shouldSkipFileTypes(file)) return true;
    }

    if (!skipParseTypeInFiles || !skipParseTypeInFiles.length) return false;

    if (skipParseTypeInFiles.find((x) => file.includes(x))) {
        return true;
    }

    return false;
};

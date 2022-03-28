import { resolve } from "path";
import { getRelativeDirectories } from "../utils/get-directories";
import { assertSchema, basePath } from "./assertSchema";

describe("createSchema", () => {
    it("with-promise-type", assertSchema("with-promise-type", { type: "MyObject" }));

    it("generic-type-name", assertSchema("generic-type-name", { type: "MyObject" }));
    it("any-unknown", assertSchema("any-unknown", { type: "MyObject", allowArbitraryDataTypes: true }));
    it("typeof-keyof", assertSchema("typeof-keyof", { expose: "export" }));
    it("function-with-tag", assertSchema("function-with-tag", { jsDoc: "extended" }));

    it(
        "sort",
        assertSchema("sort", {
            sortProps: true,
            skipParseFiles: ["@types/react/index.d.ts", "lib.dom.d.ts"],
            skipParseTypes: ["Placement", "Instance"],
            expose: "none",
        })
    );
    it("react-class", assertSchema("react-class", { expose: "all" }));
    it(
        "ignoreMultipleDefinitions",
        assertSchema("ignoreMultipleDefinitions", { type: "Props", ignoreMultipleDefinitions: true })
    );
    it(
        "function-prop-type",
        assertSchema("function-prop-type", { handleUnknownTypes: true, allowArbitraryDataTypes: true })
    );
    it("function-prop-type2", assertSchema("function-prop-type-2"));
    it("function-prop-type-alias", assertSchema("function-prop-type-alias"));
    it("module-function-declare", assertSchema("module-function-declare"));
    it("typescript-html-element-type", assertSchema("typescript-html-element-type"));
    it("extends-from-packages", assertSchema("extends-from-packages", { type: "MyProps", handleUnknownTypes: true }));
    it("circular-ref-union", assertSchema("circular-ref-union", { type: "MyType", expose: "all" }));
    it("skipFiles option", assertSchema("skipFiles", { type: "MyType", skipParseFiles: ["external-props.ts"] }));
    it("skipTypes option", assertSchema("skipTypes", { type: "MyType", skipParseTypes: ["ExternalProps"] }));
    it("skip-function-types", assertSchema("skip-function-types", { type: "MyObject", skipParseTypes: ["function"] }));
    it(
        "should parse type even if type is in skipParseFiles list",
        assertSchema("skipFiles-with-forceToParseTypes", {
            type: "MyType",
            skipParseFiles: ["external-props.ts"],
            forceToParseTypes: ["ExternalProps"],
        })
    );
    it(
        "should parse type even if type is in skipTypes list",
        assertSchema("skipTypes-with-forceToParseTypes", {
            type: "MyType",
            skipParseTypes: ["ExternalProps"],
            forceToParseTypes: ["ExternalProps"],
        })
    );

    it(
        "should not parse node when shouldParseNode return false",
        assertSchema("shouldParseNode-option", {
            expose: "none",
            type: "MyType",
            shouldParseNode: (node) => {
                const file = node.getSourceFile().fileName;
                if (file.endsWith("external-props.ts")) {
                    return false;
                }
                return true;
            },
        })
    );

    it(
        "should parse node even if shouldParseNode return false",
        assertSchema("shouldParseNode-option-force", {
            type: "MyType",
            forceToParseTypes: ["ExternalProps"],
            expose: "none",
            shouldParseNode: (node) => {
                const file = node.getSourceFile().fileName;
                if (file.endsWith("external-props.ts")) {
                    return false;
                }
                return true;
            },
        })
    );

    const dirs = getRelativeDirectories(resolve(`${basePath}/limit-options`));
    dirs.forEach((dir) => {
        it(
            "excludeRootProps" + dir,
            assertSchema("limit-options/" + dir, {
                type: "MyObject",
                handleUnknownTypes: true,
                excludeRootProps: ["c", "a.b.c", "with-dash", "a.b.d.e", "x.d.e.f", "x.y", "a.b.x.c"],
                expose: "none",
                schemaExtension: "excludeRootProps",
            })
        );
    });

    dirs.forEach((dir) => {
        it(
            "includeProps" + dir,
            assertSchema("limit-options/" + dir, {
                type: "MyObject",
                handleUnknownTypes: true,
                includeProps: ["a.b", "c", "with-dash", "x"],
                expose: "none",
                schemaExtension: "includeProps",
            })
        );
    });

    dirs.forEach((dir) => {
        it(
            "maxDepth-1" + dir,
            assertSchema("limit-options/" + dir, {
                type: "MyObject",
                handleUnknownTypes: true,
                maxDepth: 1,
                expose: "none",
                schemaExtension: "maxDepth-1",
            })
        );
    });

    dirs.forEach((dir) => {
        it(
            "includeProps-maxDepth" + dir,
            assertSchema("limit-options/" + dir, {
                type: "MyObject",
                handleUnknownTypes: true,
                maxDepth: 2,
                expose: "none",
                schemaExtension: "includeProps-maxDepth",
                includeProps: ["a"],
            })
        );
    });

    dirs.forEach((dir) => {
        it(
            "excludeRootProps-maxDepth" + dir,
            assertSchema("limit-options/" + dir, {
                type: "MyObject",
                handleUnknownTypes: true,
                maxDepth: 1,
                expose: "none",
                schemaExtension: "excludeRootProps-maxDepth",
                excludeRootProps: ["c", "b"],
            })
        );
    });

    dirs.forEach((dir) => {
        it(
            "excludeProps" + dir,
            assertSchema("limit-options/" + dir, {
                type: "MyObject",
                handleUnknownTypes: true,
                expose: "none",
                schemaExtension: "excludeProps",
                excludeProps: ["a", "b"],
            })
        );
    });

    const limitOptionsFunctionsDirs = getRelativeDirectories(resolve(`${basePath}/limit-options-functions`));

    limitOptionsFunctionsDirs.forEach((dir) => {
        it(
            "limit-options-functions/" + dir,
            assertSchema("limit-options-functions/" + dir, {
                type: "MyObject",
                schemaExtension: "funcParamMaxDepth-1",
                handleUnknownTypes: true,
                expose: "none",
                funcParamMaxDepth: 1,
            })
        );
    });

    limitOptionsFunctionsDirs.forEach((dir) => {
        it(
            "limit-options-functions/" + dir,
            assertSchema("limit-options-functions/" + dir, {
                type: "MyObject",
                schemaExtension: "funcParamMaxDepth-2",
                handleUnknownTypes: true,
                expose: "none",
                funcParamMaxDepth: 2,
            })
        );
    });

    limitOptionsFunctionsDirs.forEach((dir) => {
        it(
            "limit-options-functions/" + dir,
            assertSchema("limit-options-functions/" + dir, {
                type: "MyObject",
                schemaExtension: "includeProps-a",
                handleUnknownTypes: true,
                expose: "none",
                includeProps: ["a"],
            })
        );
    });
});

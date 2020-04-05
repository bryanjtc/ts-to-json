import { resolve } from "path";
import * as fs from "fs";
import * as ts from "typescript";
import { createFormatter } from "../../factory/formatter";
import { createParser } from "../../factory/parser";
import { createProgram } from "../../factory/program";
import { Config } from "../../src/Config";
import { SchemaGenerator } from "../../src/SchemaGenerator";
import { getRelativeDirectories } from "../utils/get-directories";

const basePath = "test/snapshot-data";

interface Options extends Partial<Config> {
    schemaExtension?: string;
}

function assertSchema(relativePath: string, options?: Options) {
    return () => {
        const filePath = resolve(`${basePath}/${relativePath}/*.ts`);

        const config: Config = {
            path: filePath,
            expose: "export",
            topRef: true,
            jsDoc: "none",
            skipTypeCheck: true,
            skipParseFiles: ["lib.dom.d.ts"],
            encodeRefs: false,
            ...options,
        };

        const program: ts.Program = createProgram(config);
        const generator: SchemaGenerator = new SchemaGenerator(
            program,
            createParser(program, config),
            createFormatter(config),
            config
        );

        const schema = generator.createSchema(config.type);

        const jsonFilePath = resolve(
            `${basePath}/${relativePath}/${
                options && options.schemaExtension ? options.schemaExtension + "-" : ""
            }schema.json`
        );

        if (!fs.existsSync(jsonFilePath)) {
            fs.writeFileSync(jsonFilePath, JSON.stringify(schema, null, 4) + "\n", "utf8");
        }

        const expected: any = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
        const actual: any = JSON.parse(JSON.stringify(schema));

        try {
            expect(actual).toEqual(expected);
        } catch (error) {
            console.error(filePath);
            throw new Error(error);
        }
    };
}

describe("createSchema", () => {
    it("react-class", assertSchema("react-class", { expose: "all" }));
    it(
        "ignoreMultipleDefinitions",
        assertSchema("ignoreMultipleDefinitions", { type: "Props", ignoreMultipleDefinitions: true })
    );
    it("function-prop-type", assertSchema("function-prop-type"));
    it("module-function-declare", assertSchema("module-function-declare"));
    it("typescript-html-element-type", assertSchema("typescript-html-element-type"));
    it("extends-from-packages", assertSchema("extends-from-packages", { type: "MyProps" }));
    it("circular-ref-union", assertSchema("circular-ref-union", { type: "MyType", expose: "all" }));
    it("skipFiles option", assertSchema("skipFiles", { type: "MyType", skipParseFiles: ["external-props.ts"] }));
    it("skipTypes option", assertSchema("skipTypes", { type: "MyType", skipParseTypes: ["ExternalProps"] }));
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
<<<<<<< HEAD
            "excludeRootProps" + dir,
            assertSchema("limit-options/" + dir, {
                type: "MyObject",
                handleUnknownTypes: true,
                excludeRootProps: ["c", "a.b.c", "with-dash", "a.b.d.e", "x.d.e.f", "x.y", "a.b.x.c"],
                expose: "none",
                schemaExtension: "excludeRootProps",
=======
            "skipParseRootPropTypes" + dir,
            assertSchema("limit-options/" + dir, {
                type: "MyObject",
                handleUnknownTypes: true,
                skipParseRootPropTypes: ["c", "a.b.c", "with-dash", "a.b.d.e", "x.d.e.f", "x.y", "a.b.x.c"],
                expose: "none",
                schemaExtension: "skipParseRootPropTypes",
>>>>>>> 28974e24f7ccdf4e1df67d2a47c27e227c44b4a3
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
<<<<<<< HEAD
            "excludeRootProps-maxDepth" + dir,
=======
            "skipParseRootPropTypes-maxDepth" + dir,
>>>>>>> 28974e24f7ccdf4e1df67d2a47c27e227c44b4a3
            assertSchema("limit-options/" + dir, {
                type: "MyObject",
                handleUnknownTypes: true,
                maxDepth: 1,
                expose: "none",
<<<<<<< HEAD
                schemaExtension: "excludeRootProps-maxDepth",
                excludeRootProps: ["c", "b"],
=======
                schemaExtension: "skipParseRootPropTypes-maxDepth",
                skipParseRootPropTypes: ["c", "b"],
>>>>>>> 28974e24f7ccdf4e1df67d2a47c27e227c44b4a3
            })
        );
    });

    dirs.forEach((dir) => {
        it(
<<<<<<< HEAD
            "excludeProps" + dir,
=======
            "skipParsePropTypes" + dir,
>>>>>>> 28974e24f7ccdf4e1df67d2a47c27e227c44b4a3
            assertSchema("limit-options/" + dir, {
                type: "MyObject",
                handleUnknownTypes: true,
                expose: "none",
<<<<<<< HEAD
                schemaExtension: "excludeProps",
                excludeProps: ["a", "b"],
=======
                schemaExtension: "skipParsePropTypes",
                skipParsePropTypes: ["a", "b"],
>>>>>>> 28974e24f7ccdf4e1df67d2a47c27e227c44b4a3
            })
        );
    });
});

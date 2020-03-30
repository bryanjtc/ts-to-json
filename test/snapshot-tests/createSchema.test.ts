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
            skipParseTypeInFiles: ["lib.dom.d.ts"],
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
    it("function-prop-type", assertSchema("function-prop-type"));
    it("module-function-declare", assertSchema("module-function-declare"));
    it("typescript-html-element-type", assertSchema("typescript-html-element-type"));
    it("extends-from-packages", assertSchema("extends-from-packages", { type: "MyProps" }));
    it("circular-ref-union", assertSchema("circular-ref-union", { type: "MyType", expose: "all" }));
    it("skipFiles option", assertSchema("skipFiles", { type: "MyType", skipParseTypeInFiles: ["external-props.ts"] }));
    it("skipTypes option", assertSchema("skipTypes", { type: "MyType", skipParseTypes: ["ExternalProps"] }));
    it(
        "should parse type even if type is in skipFiles list",
        assertSchema("skipFiles-with-forceToParseTypes", {
            type: "MyType",
            skipParseTypeInFiles: ["external-props.ts"],
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
        "should not parse when shouldSkipFileTypes return true",
        assertSchema("shouldSkipFileTypes-option", {
            type: "MyType",
            shouldSkipFileTypes: (path: string) => path.endsWith("external-props.ts"),
        })
    );

    const dirs = getRelativeDirectories(resolve(`${basePath}/limit-options`));
    dirs.forEach((dir) => {
        it(
            "excludeProperties" + dir,
            assertSchema("limit-options/" + dir, {
                type: "MyObject",
                handleUnknownTypes: true,
                excludeProps: ["c", "a.b.c", "with-dash", "a.b.d.e", "x.d.e.f", "x.y", "a.b.x.c"],
                expose: "none",
                schemaExtension: "excludeProperties",
            })
        );
    });

    dirs.forEach((dir) => {
        it(
            "includeProperties" + dir,
            assertSchema("limit-options/" + dir, {
                type: "MyObject",
                handleUnknownTypes: true,
                includeProps: ["a.b", "c", "with-dash", "x"],
                expose: "none",
                schemaExtension: "includeProperties",
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
            "includeProperties-maxDepth" + dir,
            assertSchema("limit-options/" + dir, {
                type: "MyObject",
                handleUnknownTypes: true,
                maxDepth: 2,
                expose: "none",
                schemaExtension: "includeProperties-maxDepth",
                includeProps: ["a"],
            })
        );
    });

    dirs.forEach((dir) => {
        it(
            "excludeProperties-maxDepth" + dir,
            assertSchema("limit-options/" + dir, {
                type: "MyObject",
                handleUnknownTypes: true,
                maxDepth: 1,
                expose: "none",
                schemaExtension: "excludeProperties-maxDepth",
                excludeProps: ["c", "b"],
            })
        );
    });
});

// import * as functionTestFiles from "../valid-data/function";
import { resolve } from "path";
import * as fs from "fs";
import * as ts from "typescript";
import { createFormatter } from "../../factory/formatter";
import { createParser } from "../../factory/parser";
import { createProgram } from "../../factory/program";
import { Config } from "../../src/Config";
import { SchemaGenerator } from "../../src/SchemaGenerator";

const basePath = "test/snapshot-data";

function assertSchema(relativePath: string, filterNode: (node: ts.Node) => boolean, extraTags?: Config["extraTags"]) {
    return () => {
        const filePath = resolve(`${basePath}/${relativePath}/*.ts`);

        const config: Config = {
            expose: "none",
            topRef: true,
            jsDoc: "extended",
            path: filePath,
            extraTags,
            skipTypeCheck: true,
            skipParseFiles: ["lib.dom.d.ts"],
            handleUnknownTypes: true,
        };

        const program: ts.Program = createProgram(config);

        const generator: SchemaGenerator = new SchemaGenerator(
            program,
            createParser(program, config),
            createFormatter(config)
        );

        const schema = generator.createSchemaByFilter(filterNode);

        const jsonFilePath = resolve(`${basePath}/${relativePath}/schema.json`);

        if (!fs.existsSync(jsonFilePath)) {
            fs.writeFileSync(jsonFilePath, JSON.stringify(schema, null, 4) + "\n", "utf8");
        }

        const expected: any = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
        const actual: any = JSON.parse(JSON.stringify(schema));

        expect(actual).toEqual(expected);
    };
}

describe("createSchemaByNodeKind", () => {
    it(
        "module-function-declare-by-filter",
        assertSchema("module-function-declare-by-filter", (node) => {
            if (node.kind === ts.SyntaxKind.FunctionDeclaration) {
                return true;
            }

            return false;
        })
    );
});

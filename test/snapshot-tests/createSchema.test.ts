import { resolve } from "path";
import * as fs from "fs";
import * as ts from "typescript";
import { createFormatter } from "../../factory/formatter";
import { createParser } from "../../factory/parser";
import { createProgram } from "../../factory/program";
import { Config } from "../../src/Config";
import { SchemaGenerator } from "../../src/SchemaGenerator";

const basePath = "test/snapshot-data";

function assertSchema(relativePath: string, options?: Partial<Config>) {
    return () => {
        const filePath = resolve(`${basePath}/${relativePath}/*.ts`);

        const config: Config = {
            path: filePath,
            expose: "export",
            topRef: true,
            jsDoc: "none",
            skipTypeCheck: true,
            useTypescriptTypeName: true,
            setObjectIdentifier: true,
            ...options,
        };

        const program: ts.Program = createProgram(config);
        const generator: SchemaGenerator = new SchemaGenerator(
            program,
            createParser(program, config),
            createFormatter(config)
        );

        const schema = generator.createSchema(config.type);

        const jsonFilePath = resolve(`${basePath}/${relativePath}/schema.json`);

        if (!fs.existsSync(jsonFilePath)) {
            fs.writeFileSync(jsonFilePath, JSON.stringify(schema, null, 4) + "\n", "utf8");
        }
        // console.log(JSON.stringify(schema, null, 4));

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
    it("function-prop-type", assertSchema("function-prop-type"));
    it("module-function-declare", assertSchema("module-function-declare"));
    it("typescript-html-element-type", assertSchema("typescript-html-element-type"));
    it("extends-from-packages", assertSchema("extends-from-packages", { type: "MyProps", expose: "none" }));
    // it("max-depth", assertSchema("max-depth"));
});

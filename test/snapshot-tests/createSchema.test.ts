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

        const jsonFilePath = resolve(`${basePath}/${relativePath}/schema.json`);

        if (!fs.existsSync(jsonFilePath)) {
            fs.writeFileSync(jsonFilePath, JSON.stringify(schema, null, 4) + "\n", "utf8");
        }
        // console.log(JSON.stringify(schema, null, 2));

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
    it("max-depth", assertSchema("max-depth", { maxDepth: 3 }));
    it("max-depth-ref", assertSchema("max-depth-ref", { maxDepth: 3 }));
    it(
        "max-depth-function-param",
        assertSchema("max-depth-function-param", { maxDepth: 3, type: "MyFunction", expose: "none" })
    );
    it(
        "max-depth-function-param-ref",
        assertSchema("max-depth-function-param-ref", { maxDepth: 3, type: "MyFunction" })
    );
});

import { resolve } from "path";
import * as fs from "fs";
import * as ts from "typescript";
import { createFormatter } from "../../factory/formatter";
import { createParser } from "../../factory/parser";
import { createProgram } from "../../factory/program";
import { Config } from "../../src/Config";
import { SchemaGenerator } from "../../src/SchemaGenerator";

export const basePath = "test/snapshot-data";

interface Options extends Partial<Config> {
    schemaExtension?: string;
}

export function assertSchema(relativePath: string, options?: Options) {
    return () => {
        const filePath = resolve(`${basePath}/${relativePath}/*.ts`);

        const config: Config = {
            encodeRefs: false,
            expose: "export",
            // handleUnknownTypes: true,
            jsDoc: "none",
            path: filePath,
            skipParseFiles: ["lib.dom.d.ts"],
            skipTypeCheck: true,
            topRef: true,
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

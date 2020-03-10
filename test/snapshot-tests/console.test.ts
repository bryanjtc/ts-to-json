import { resolve } from "path";
import * as ts from "typescript";
import { createFormatter } from "../../factory/formatter";
import { createParser } from "../../factory/parser";
import { createProgram } from "../../factory/program";
import { Config } from "../../src/Config";
import { SchemaGenerator } from "../../src/SchemaGenerator";
import mockConsole from "jest-mock-console";

function assertSchema(name: string, type: string, message: string) {
    return () => {
        const restoreConsole = mockConsole();
        const config: Config = {
            path: resolve(`test/snapshot-data/${name}/*.ts`),
            type: type,
            expose: "export",
            topRef: true,
            jsDoc: "none",
            skipTypeCheck: false,
        };

        const program: ts.Program = createProgram(config);

        const generator: SchemaGenerator = new SchemaGenerator(
            program,
            createParser(program, config),
            createFormatter(config)
        );

        generator.createSchema(type);

        expect(console.error).toHaveBeenCalledWith(message);

        restoreConsole();
    };
}

describe("invalid-data", () => {
    it(
        "global-types",
        assertSchema(
            "global-types",
            "MyType",
            "TypeReferenceNodeParser => Unable to parse node 'GlobalTypes.MyType', are you using global types?"
        )
    );
});

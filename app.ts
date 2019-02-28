import * as Ajv from "ajv";
import { readFileSync } from "fs";
import { resolve } from "path";
import * as ts from "typescript";
import { createFormatter } from "./factory/formatter";
import { createParser } from "./factory/parser";
import { createProgram } from "./factory/program";
import { Config, DEFAULT_CONFIG } from "./src/Config";
import { Schema } from "./src/Schema/Schema";
import { SchemaGenerator } from "./src/SchemaGenerator";

const basePath = "test/";
const config: Config = {
    type: "MyObject",
    expose: "all",
    topRef: true,
    jsDoc: "extended",
    path: resolve(`test.ts`),
};
const program: ts.Program = createProgram(config);
const generator: SchemaGenerator = new SchemaGenerator(
    program,
    createParser(program, config),
    createFormatter(config),
);


console.log(JSON.stringify(generator.createSchema("MyObject"), null, "  "));

// const rootTypes = getRootTypes(program, config.path);
// // @ts-ignore
// let allSchema: Schema = { definitions: {} };
// rootTypes.forEach((typ) => {
//     const schema = generator.createSchema(typ);
//     allSchema = {
//         ...allSchema,
//         definitions: {
//             ...allSchema.definitions, ...schema.definitions,
//         },
//     };
// });

// console.log(JSON.stringify(allSchema, null, "  "));

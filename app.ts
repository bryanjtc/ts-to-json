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
import * as tsj from "./index";

const config: Config = {
    // type: "AllTypes",
    expose: "export",
    topRef: true,
    jsDoc: "extended",
    path: resolve("test.ts"),
    skipTypeCheck: true
    // tsconfig: resolve("tsconfig2.json")
};

const gen = tsj.createGenerator(config);
const schema = gen.createSchema(config.type);

console.log(JSON.stringify(schema, null, "  "));

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

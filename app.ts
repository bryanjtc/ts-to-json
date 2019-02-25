// import * as Ajv from "ajv";
// import { readFileSync } from "fs";
// import { resolve } from "path";
// import * as ts from "typescript";
// import { createFormatter } from "./factory/formatter";
// import { createParser } from "./factory/parser";
// import { createProgram } from "./factory/program";
// import { Config, DEFAULT_CONFIG } from "./src/Config";
// import { Schema } from "./src/Schema/Schema";
// import { SchemaGenerator } from "./src/SchemaGenerator";
// import { getRootTypes } from "./src/Utils";

// const basePath = "test/";

// const config: Config = {
//     ...DEFAULT_CONFIG,
//     type: "*",
//     expose: "all",
//     topRef: true,
//     jsDoc: "extended",
//     path: resolve(`${basePath}/test.ts`),
// };

// const program: ts.Program = createProgram(config);
// const rootTypes = getRootTypes(program, config.path);
// const generator: SchemaGenerator = new SchemaGenerator(
//     program,
//     createParser(program, config),
//     createFormatter(config),
// );
// // @ts-ignore
// let allSchema: Schema = { definitions: {} };
// rootTypes.forEach((typ) => {
//     const schema = generator.createSchema(typ);
//     console.log(rootTypes, JSON.stringify(schema, null, "  "));

//     allSchema = {
//         ...allSchema,
//         definitions: {
//             ...allSchema.definitions, ...schema.definitions,
//         },
//     };
// });
console.log('rootTypes, JSON.stringify(allSchema, null, "  ")');

// const schema = generator.createSchema(type);

// console.log(rootTypes, JSON.stringify(schema, null, "  "));

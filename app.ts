import { resolve } from "path";
import * as ts from "typescript";
import { createFormatter } from "./factory/formatter";
import { createParser } from "./factory/parser";
import { createProgram } from "./factory/program";
import { Config } from "./src/Config";

import { SchemaGenerator } from "./src/SchemaGenerator";

// const config: Config = {
//     type: "*",
//     expose: "none",
//     topRef: true,
//     jsDoc: "extended",
//     path: resolve(`test.ts`),
// };
// const program: ts.Program = createProgram(config);
// const generator: SchemaGenerator = new SchemaGenerator(program, createParser(program, config), createFormatter(config));

// console.log(JSON.stringify(generator.createSchemaByNodeKind(ts.SyntaxKind.FunctionDeclaration, true), null, "  "));
const config: Config = {
    path: resolve(`test.ts`),
    // type,
    expose: "export",
    topRef: true,
    jsDoc: "none",
    // extraTags: Config["extraTags"],
    skipTypeCheck: true,
};

const program: ts.Program = createProgram(config);

const generator: SchemaGenerator = new SchemaGenerator(program, createParser(program, config), createFormatter(config));

const schema = generator.createSchema("MyObject1");

console.log(JSON.stringify(schema, null, " "));

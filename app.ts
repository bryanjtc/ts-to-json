import { resolve } from "path";

import { Config } from "./src/Config";

import * as tsj from "./index";

const config: Config = {
    type: "IOption",
    expose: "all",
    topRef: true,
    jsDoc: "extended",
    path: resolve("test.ts"),
    skipTypeCheck: true,
    // tsconfig: resolve("tsconfig2.json")
};

const gen = tsj.createGenerator(config);
const schema = gen.createSchema(config.type!);

console.log(JSON.stringify(schema, null, "  "));

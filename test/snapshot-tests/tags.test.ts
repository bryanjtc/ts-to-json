// import * as functionTestFiles from "../valid-data/function";

import { assertSchema } from "./assertSchema";

describe("tags", () => {
    it(
        "tags-merge",
        assertSchema("tags-merge", {
            extraTags: ["props"],
            expose: "export",
            jsDoc: "extended",
        })
    );
    it(
        "tags-merge-recursion",
        assertSchema("tags-merge-recursion", {
            extraTags: ["props"],
            expose: "none",
            jsDoc: "extended",
            type: "MyObject",
        })
    );
});

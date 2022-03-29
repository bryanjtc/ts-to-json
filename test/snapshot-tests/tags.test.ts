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

    it(
        "tags-with-asterisk-wildcard",
        assertSchema("tags-with-asterisk-wildcard", {
            extraTags: ["props*"],
            expose: "export",
            jsDoc: "extended",
        })
    );
});

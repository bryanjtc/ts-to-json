export interface Config {
    path?: string;
    type?: string;
    tsconfig?: string;
    expose: "all" | "none" | "export";
    topRef: boolean;
    jsDoc: "none" | "extended" | "basic";
    sortProps?: boolean;
    strictTuples?: boolean;
    skipTypeCheck?: boolean;
    encodeRefs?: boolean;
    extraTags?: string[];
    setObjectIdentifier?: boolean;
    maxDepth?: number;
    handleUnknownTypes?: boolean;
    /*
    types within the file wont be processed, instead name of type will be returned.
    like HTMLElement in lib.dom.d.ts file
    */
    skipFiles?: string[];
    /*
    type names within the list wont be proceeded instead name of the type will be returned.
    like HTMLElement will stay  HTMLElement
    */
    skipTypes?: string[];
    /*
    type names within the list must be processed even if its in skipFiles or skipTypes list
    */
    processTypes?: string[];
}

export const DEFAULT_CONFIG: Config = {
    expose: "export",
    topRef: true,
    jsDoc: "extended",
    sortProps: true,
    strictTuples: false,
    skipTypeCheck: false,
    encodeRefs: true,
    extraTags: [],
};

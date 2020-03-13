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
    /**
     *   Types located in the file wont be processed, instead name of type will be returned.
     *   e.g. HTMLElement is located in lib.dom.d.ts file, hence the HTMLElement will be the type
     */
    skipFiles?: string[];
    /**
     *   Type names within the list wont be proceeded instead the name of the type will be returned.
     *   e.g. HTMLElement will stay HTMLElement
     */
    skipTypes?: string[];
    /**
     *   Names within the list must be processed even if its in skipFiles or skipTypes list
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

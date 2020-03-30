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
    /**
     *   If returns true the type name will be used instead of processing type and it children.
     *   e.g. HTMLElement will stay HTMLElement
     */
    shouldSkipFileTypes?: (path: string) => boolean | undefined;
    /**
     *  Use this option when parser unable to parse specific type and throws error.
     *  This option force the parser identified type as unknown type.
     */
    handleUnknownTypes?: boolean;
    /**
     *   When unknown type detected, the node info will be displayed.
     */
    showUnknownTypeInfo?: boolean;
    /**
     *   Types located in the file wont be processed, instead name of type will be returned.
     *   e.g. HTMLElement is located in lib.dom.d.ts file, hence the HTMLElement will be the type
     */
    skipParseTypeInFiles?: string[];
    /**
     *   Type names within the list wont be proceeded instead the name of the type will be returned.
     *   e.g. HTMLElement will stay HTMLElement
     */
    skipParseTypes?: string[];
    /**
     *   Names within the list must be processed even if its in skipFiles or skipTypes list
     */
    forceToParseTypes?: string[];
    /**
     *   Will exclude type names specified in the list.
     */
    excludeProps?: string[];
    /**
     *  Will only generate schema for the property names included in the list.
     *  excludeProperties option has no effect when using this option.
     */
    includeProps?: string[];

    /**
     *  This option has priority over includeProperties and excludeProperties options.
     */
    maxDepth?: number;
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
    showUnknownTypeInfo: true,
};

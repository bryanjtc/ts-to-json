export type RawType = number | boolean | string | null;

export interface Definition {
    $ref?: string;
    description?: string;
    not?: Definition;
    allOf?: Definition[];
    oneOf?: Definition[];
    anyOf?: Definition[];
    title?: string;
    type?: string | string[];
    format?: string;
    items?: Definition | Definition[];
    minItems?: number;
    maxItems?: number;
    additionalItems?: Definition;
    enum?: (RawType | Definition)[];
    default?: RawType | Object;
    additionalProperties?: false | Definition;
    required?: string[];
    propertyOrder?: string[];
    properties?: DefinitionMap;
    parameters?: DefinitionMap;
    defaultProperties?: string[];
    locale?: string;
    typeOf?: "function";
}

export interface DefinitionMap {
    [name: string]: Definition;
}

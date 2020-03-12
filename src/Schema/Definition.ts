import { JSONSchema7, JSONSchema7Definition } from "json-schema";

export interface Definition extends JSONSchema7 {
    propertyOrder?: string[];
    parameters?: JSONSchema7Definition;
    defaultProperties?: string[];
    locale?: string;
    kind?: "function";
    name?: string;
    label?: string;
}

export interface DefinitionMap {
    [name: string]: JSONSchema7Definition;
}

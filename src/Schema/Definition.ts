import { JSONSchema7 } from "json-schema";

export type JSONSchemaDefinition = JSONSchema7 | boolean;

export interface Definition extends JSONSchema7 {
    propertyOrder?: string[];
    parameters?: { [key: string]: JSONSchema7 };
    properties?: {
        [key: string]: Definition | JSONSchemaDefinition;
    };
    defaultProperties?: string[];
    locale?: string;
    kind?: "function";
    name?: string;
    label?: string;
}

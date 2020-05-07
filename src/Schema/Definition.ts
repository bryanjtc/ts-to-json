import { JSONSchema7, JSONSchema7Definition } from "json-schema";

export interface Definition extends JSONSchema7 {
    propertyOrder?: string[];
    parameters?: { [key: string]: JSONSchema7 };
    defaultProperties?: string[];
    locale?: string;
    kind?: "function";
    name?: string;
    label?: string;
}

export { JSONSchema7Definition as JSONSchemaDefinition };

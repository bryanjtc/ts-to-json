/*
    problem using object in condition:
    https://github.com/vega/ts-json-schema-generator/issues/370
*/
export type Conditional<T> = T extends number
    ? { b: { c: string } }
    : T extends string
    ? { d: { e: { f: string } } }
    : { c: null };

export interface MyObject {
    a: Conditional<number>;
    x: Conditional<string>;
    h: Conditional<null>;
}

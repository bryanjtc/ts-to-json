/*
    problem using object in condition:
    https://github.com/vega/ts-json-schema-generator/issues/370
*/
export type Conditional<T> = T extends number
    ? { b: { c: number } }
    : T extends string
    ? { a: { b: { c: string } } }
    : { c: null };

export interface MyObject extends Conditional<number>, Conditional<string>, Conditional<null> {}

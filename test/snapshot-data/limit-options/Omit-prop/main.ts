//https://github.com/vega/ts-json-schema-generator/issues/192
export interface MyObject {
    a: number;
    c: number;
    d: Omit<MyObject, "c">;
}

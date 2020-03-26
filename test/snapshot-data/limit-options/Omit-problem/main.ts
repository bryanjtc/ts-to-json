// will not generate anything because of following issus
//https://github.com/vega/ts-json-schema-generator/issues/192
export interface MyObject {
    a: number;
    b: number;
    d: Omit<MyObject, "b">;
}

interface MyGeneric<A, B> {
    b: { c: A };
    c: B;
}

export interface MyObject {
    a: MyGeneric<string, number>;
    d: MyGeneric<number, string>;
}

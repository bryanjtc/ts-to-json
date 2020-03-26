export interface MyObject extends SubNamespace.HelperA {
    a: SubNamespace.HelperA;
    l: MyObject;
    d: SubNamespace.HelperA;
}

namespace SubNamespace {
    export interface HelperA {
        c: number;
        b: {
            c: string;
        };
    }
}

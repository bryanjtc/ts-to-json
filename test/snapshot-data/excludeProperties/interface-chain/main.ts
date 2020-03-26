export interface MyObject {
    a: MyType1;
    b: string;
    c: string;
}
interface MyType1 {
    b: {
        c: string;
        d: {
            e: string;
        };
    };
    e: string;
    c: string;
}

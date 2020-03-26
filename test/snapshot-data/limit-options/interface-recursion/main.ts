export interface MyObject {
    a: MyObject;
    b: MyObject;
    c: string;
    d: {
        e: MyObject;
        c: string;
        f: {
            e: MyObject;
            c: string;
        };
    };
}

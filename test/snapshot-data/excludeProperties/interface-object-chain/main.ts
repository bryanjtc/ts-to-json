export interface MyObject {
    a: {
        b: {
            x: MyObject1;
            c: string;
        };
        d: string;
    };
    c: string;
}

export interface MyObject1 {
    c: string;
}

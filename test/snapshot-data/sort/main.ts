export interface MyObject {
    c: string;
    b: string;
    a: string;
    h: {
        c: string;
        b: string;
        a: string;
    };
}

export interface MyObject2 {
    a: MyObject;
    func: (options: MyObject) => MyObject;
}

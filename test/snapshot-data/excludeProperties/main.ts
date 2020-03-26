export interface MyObject {
    a: {
        b: {
            x: MyObject1;
        };
        d: string;
    };
    b: MyObject1;
    c: string;
}

export interface MyObject1 {
    c: string;
}

// export interface MyObject extends MyTypeB, MyTypeC {
//     a: MyTypeB;
// }

// export interface MyTypeB {
//     b: MyTypeC;
// }

// export interface MyTypeC {
//     c: string;
// }

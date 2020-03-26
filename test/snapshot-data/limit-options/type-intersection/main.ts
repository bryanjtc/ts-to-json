export interface Type1 {
    b: Type2 & { f: string };
}
export interface Type2 {
    c: number;
}

export interface MyObject {
    a: Type1 & {
        c: string;
    };
}

// const ob: MyObject = {
//     a: {b:{c}},
// };

// a.b.d.e;

export interface A {
    a: string;
}

export interface B {
    c: string;
    b: string;
}

export interface C {
    c: string;
}

export type MyObject = A | B | C;

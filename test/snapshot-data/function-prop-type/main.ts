export interface MyObject {
    a: (ref: string) => void;
    b: (ref: string) => string;
    c: <T>(arg: T) => T | string;
    e<T>(arg: T): T | string;
    F<T, P>(arg: T): T | P;
}

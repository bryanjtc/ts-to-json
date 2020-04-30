interface Prop {
    a<T, P>(arg: T): T | P;
}

export type MyObject = Prop;

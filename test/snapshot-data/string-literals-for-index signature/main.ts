interface Foo {
    foo: string;
}

interface Bar {
    prop1: string;
    prop2: string;
}

type MergeKeys<A, B> = {
    [P in `${Exclude<keyof A, symbol>}_${Exclude<keyof B, symbol>}`]: string;
};

export type MyObject = MergeKeys<Foo, Bar>;

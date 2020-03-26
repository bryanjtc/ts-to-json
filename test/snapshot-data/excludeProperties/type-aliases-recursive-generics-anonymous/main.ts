type Map<T> = { [key: string]: T };

export type MyObject = {
    a: Map<MyObject>;
    b: {
        c: string;
    };
    c: string;
};

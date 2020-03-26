type SomeKeys = "a" | "b" | "c";

export type MyObject = {
    a: { b: { [P in SomeKeys]: string } };
    b: { [P in SomeKeys]: string };
};

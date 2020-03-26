type SomeKeys = "a" | "b" | "c";

export type MyObject = {
    [P in SomeKeys]: string;
};

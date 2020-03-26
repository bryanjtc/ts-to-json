type SomeKeys = "l" | "s";

export type MyObject = {
    a: { [P in SomeKeys]: string };
    // b: { [P in SomeKeys]: string };
};

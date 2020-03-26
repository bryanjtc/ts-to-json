enum Test {
    a = "a",
    b = "b",
    c = "c",
}

export type MyObject = {
    [P in Test]: string;
};

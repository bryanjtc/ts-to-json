/* eslint-disable no-shadow */
enum Test {
    a = "a",
    b = "b",
    c = "c",
}

export type MyObject = {
    a: { b: { [P in Test]: string } };
    b: { [P in Test]: string };
};

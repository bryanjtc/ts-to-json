/* eslint-disable no-shadow */
enum FromZero {
    y,
    b,
    c,
}

export type MyObject = {
    x: typeof FromZero;
};

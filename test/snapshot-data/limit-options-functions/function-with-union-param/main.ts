export interface Props2 {
    c?: "left" | "right";
}

export interface Props {
    a(b?: { c?: "left" | "right" }): void;
    d: (b?: Props2) => null;
}

export type MyObject = Props;

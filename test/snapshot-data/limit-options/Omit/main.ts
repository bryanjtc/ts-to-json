interface Props {
    a: number;
    b: number;
    c: number;
}
export type MyObject = Omit<Props, "b">;

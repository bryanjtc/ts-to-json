interface Props {
    a: number;
    c: number;
    d: number;
}
export type MyObject = Pick<Props, "c" | "d">;

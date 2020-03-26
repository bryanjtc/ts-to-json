interface Props {
    a: number;
    b: number;
    c: number;
}
export type MyObject = Pick<Props, Exclude<keyof Props, "b">>;

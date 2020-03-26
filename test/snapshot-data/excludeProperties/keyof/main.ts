interface Props {
    a: string;
    b: string;
    c: string;
}

type OmitValueRef<T> = {
    [P in keyof T]?: string;
};

export type MyObject = OmitValueRef<Props>;

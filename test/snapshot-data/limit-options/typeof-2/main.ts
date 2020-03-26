interface Props {
    a?: {
        b: {
            c: string;
        };
    };
    b?: string;
    c?: string;
    e?: {
        a?: {
            b: {
                c: string;
            };
        };
    };
}
const obj2: Props = { e: {} };
export type MyObject = typeof obj2.e;

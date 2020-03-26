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
const obj: Props = {};
export type MyObject = typeof obj;

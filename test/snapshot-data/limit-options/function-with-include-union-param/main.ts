export interface Props {
    a(
        b: string,
        c?: {
            d?: "left" | "middle" | "right";
        }
    ): void;
    b: number;
    c: string;
}

export type MyObject = Props;

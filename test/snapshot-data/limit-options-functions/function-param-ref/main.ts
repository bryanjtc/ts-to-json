export declare function MyObject(options: DeepProps, options2?: DeepProps): void;

export interface DeepProps {
    c: string;
    d: string;
    a: {
        c: string;
        b: {
            d: {
                e: string;
                f: string;
            };
            c: string;
        };
    };
}

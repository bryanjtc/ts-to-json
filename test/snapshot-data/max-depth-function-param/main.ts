export declare function MyFunction(options: DeepProps, options2?: DeepProps): void;

export interface DeepProps {
    propA: string;
    one: {
        one_a: string;
        two: {
            two_a: number;
            three: {
                three_a: boolean;
                four: {
                    five: {
                        super: "deep";
                    };
                };
            };
        };
    };
}

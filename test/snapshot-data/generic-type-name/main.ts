export interface Props<T extends boolean> {
    value1: any;
    value2: T;
}

export type MyObject<T extends boolean = true> = Props<T>;

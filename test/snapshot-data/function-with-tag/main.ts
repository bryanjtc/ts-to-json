export interface Options {
    /**
     * @default 1
     */
    height: number;
}

export interface MyObject {
    a: (option: Options) => void;
}

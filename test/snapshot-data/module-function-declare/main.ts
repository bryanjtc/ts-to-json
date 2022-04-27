/* eslint-disable @typescript-eslint/no-namespace */
export declare function MyFunction(options: MyFunction.Options): MyFunction.ReturnType;

declare namespace MyFunction {
    interface Options {
        elm: HTMLElement | string;
    }
    export interface ReturnType {
        width: number;
    }
}

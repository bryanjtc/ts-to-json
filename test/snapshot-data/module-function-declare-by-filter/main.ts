/* eslint-disable no-redeclare */
export declare function MyFunction(options: MyFunction.Options): MyFunction.ReturnType;

declare namespace MyFunction {
    interface Options {
        elm: HTMLElement | string;
    }
    export interface ReturnType {
        width: number;
    }
}

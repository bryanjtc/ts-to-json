/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-use-before-define */
export = MyFunction;

declare function MyFunction(options: MyFunction.Options): MyFunction.ReturnType;

declare namespace MyFunction {
    interface Options {
        elm: HTMLElement | string;
    }
    export interface ReturnType {
        width: number;
    }
}

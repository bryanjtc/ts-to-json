// import { Page } from "../../../../storybook-addon-snapshot-test/node_modules/playwright-core";

// // export type PlaywrightPage = {
// //     evaluate<R>(pageFunction: R): void;
// // };

// // export interface Page {
// //     click(): Promise<void>;
// //     // evaluate: <T>(pageFunction: T) => void;
// //     // a: T;
// // }

// export type PlaywrightPage = Page;

export interface PlaywrightPage {
    click<T>(): T | string;
}

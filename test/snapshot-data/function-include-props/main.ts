export interface MyObject {
    a(b?: {
        /**
         * Defaults to `left`.
         */
        c?: string;
    }): Promise<void>;
}

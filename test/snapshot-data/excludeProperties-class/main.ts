class Base<T> {
    public a: T;
}

export class MyObject1 extends Base<number> {
    public b: string;
    public c: Base<string>;
    public d: Base<boolean>;
}
/* test 2 */
export class MyObject2 {
    public a: string;
    public c?: number;
    [name: string]: string | number;
}
/* test 3 */
class Base3 {
    public a: number;
    public c: boolean;
}

export class MyObject3 extends Base3 {
    public b: string;
}

/* test 4 */
interface Props {
    b: {
        c: string;
    };
    c: boolean;
}

export class MyObject4 {
    public a: Props;
    public d: string;
}

/* test 5 */

export class MyObject5 {
    a: string;
    c: string;
}
/* test 6 */
export class MyObject6 {
    /** Property x description */
    public x: string;
    /**
     * Property y description
     * @pattern /abc/
     */
    public constructor(public a: string, public c: number) {}
}

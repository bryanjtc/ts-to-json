interface Props {
    d?: Props2;
}
interface Props2 {
    c: number;
}

export interface MyObject {
    a(b?: Props): null;
}

interface Props extends Props2 {
    b: () => void;
}

interface Props2 {
    c: () => void;
}

export interface MyObject extends Props {
    a: () => void;
}

// test 1
export interface MyType1 {
    propA: {
        propB: {
            propC: string;
        };
    };
}
// test 2
export interface MyType2 {
    propA: string;
    propB: string;
    propC: string;
}
// test 3
export interface MyType3 {
    propA: MyTypeB;
}

interface MyTypeB {
    propB: MyTypeC;
}

interface MyTypeC {
    propC: string;
}

// test 4
export interface MyType4 extends MyType1 {
    propB: string;
    propC: string;
}

// test 5
export type MyType5 = MyType2 & MyType1;

// test 6
export interface MyType6 {
    propA: MyType1;
}

// test 7
export interface MyType7 {
    propA: MyType71;
    propB: string;
    propC: string;
}
interface MyType71 {
    propB: {
        propC: string;
        propD: string;
    };
    propE: string;
    propC: string;
}

// test circular
export interface MyType8 {
    propA: MyType81;
    PropB: MyType8;
    PropD: {
        PropE: MyType8;
        propC: string;
    };
    propC: string;
}
interface MyType81 {
    propB: {
        propC: string;
        PropE: MyType8;
    };
    propF: MyType8;
    propG: string;
    propC: string;
}

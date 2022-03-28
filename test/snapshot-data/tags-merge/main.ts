/**
 * @props {"a":"a"}
 */
type PropA = string;
/**
 * @props {"b":"b"}
 */
type PropB = PropA;

/**
 * @props {"c":"c"}
 */
interface IntPops {
    /**
     * @props {"d":"d"}
     */
    a: PropB;
}

export interface MyObject {
    /**
     * @props {"e":"e"}
     */
    b: IntPops;
}

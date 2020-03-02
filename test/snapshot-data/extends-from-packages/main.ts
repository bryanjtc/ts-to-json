// import { Props } from "tippy.js";
import { TestProps } from "./Extends";

export type Placement = "left" | "right";

export interface ExtendedProp extends TestProps {
    myProp: Placement;
}

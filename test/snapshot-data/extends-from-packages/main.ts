import { Props } from "tippy.js";

// import * as Popper from "@popperjs/core";

// export type Placement = Popper.Placement;

// interface Props {
//     placment: Placement;
// }

export interface ExtendedProp extends Props {
    myProp: string;
}

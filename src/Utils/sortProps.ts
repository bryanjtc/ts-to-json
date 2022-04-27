/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Definition } from "../Schema/Definition";
import sortObject from "sortobject";

export const sortProps = (schema: Definition) => {
    const sorted = sortObject(schema);
    return sorted;
};

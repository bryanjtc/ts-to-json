import { Definition } from "../Schema/Definition";
import * as deepSortArray from "sort-keys";

export const sortProps = (schema: Definition) => {
    if (schema.definitions) {
        sortProps(schema.definitions);
    }

    Object.keys(schema).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const obj = schema[key] as Definition;
        if (obj) {
            if (obj.type === "object" && obj.properties) {
                obj.properties = deepSortArray(obj.properties);
                sortProps(obj.properties);
                if (obj.parameters) {
                    sortProps(obj.parameters as Definition);
                }
            } else if (typeof obj === "object") {
                sortProps(obj);
            }
        }
    });
    return schema;
};

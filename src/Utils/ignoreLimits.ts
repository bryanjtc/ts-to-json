import { Context } from "../NodeParser";

export const ignoreLimits = (context?: Context): boolean => {
    if (!context) return false;
    if (context.ignoreLimits) return true;
    if (context.hasParentContext()) {
        return ignoreLimits(context.getParentContext());
    }
    return false;
};

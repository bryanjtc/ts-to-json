import { Context } from "../NodeParser";
import { getTypeReferenceNodeName } from "../Utils";

export const isChildOfTypeReference = (context?: Context, typeReferenceName?: string): boolean => {
    if (!context || !typeReferenceName) return false;

    const node = context.getReference();
    if (!node) return false;

    const name = getTypeReferenceNodeName(node);
    if (name && name === typeReferenceName) return true;

    const parentContext = context.getParentContext();

    if (parentContext) {
        return isChildOfTypeReference(parentContext, typeReferenceName);
    }

    return false;
};

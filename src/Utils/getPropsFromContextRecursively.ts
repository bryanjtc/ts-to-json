import { Context } from "../NodeParser";
import { getPropName } from ".";

export function getPropsFromParentContextRecursively(context: Context, props: string[] = []): string[] {
    const parentContext = context.getParentContext();
    if (parentContext) {
        getPropsFromParentContextRecursively(parentContext, props);
    }
    const reference = context.getReference();
    if (reference) {
        const node = reference.parent;
        const propName = getPropName(node);
        if (propName) props.push(propName);
    }
    return props;
}

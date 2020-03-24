import * as ts from "typescript";
import { Config } from "../Config";
import { getPropsRecursively, isChildOfTypeReference } from "../Utils";
import { Context } from "../NodeParser";

const ignore = (context?: Context): boolean => {
    if (!context) return false;
    if (context.ignoreLimits) return true;
    if (context.hasParentContext()) {
        return ignore(context.getParentContext());
    }
    return false;
};

export const isExcludedProp = (node: ts.Node, context: Context, config: Config) => {
    if (!config.excludeProperties || !config.excludeProperties.length) return false;

    if (ignore(context)) return false;

    // const nodeType = getNodeTypeNode(node);

    if (isChildOfTypeReference(context, config.type)) {
        return false;
    }

    // if (nodeType && ts.isTypeReferenceNode(nodeType) && nodeType.typeName.getText() === config.type) {
    //     return false;
    // }

    // if (
    //     context.getReference() &&
    //     !isChildOfTopLevelType(context.getReference()?.parent!, config.type) &&
    //     (![ts.SyntaxKind.TypeLiteral].includes(node.parent.kind) ||
    //         (context.getReference() && !isChildOfTopLevelType(context.getReference()?.parent, config.type)))
    // )
    //     return false;

    const props = getPropsRecursively(node, context);
    if (!props) return false;

    const path = props?.join(".");

    if (!path || !config.excludeProperties.includes(path)) {
        return false;
    }
    return true;
};

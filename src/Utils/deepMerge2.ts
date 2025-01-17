/* eslint-disable @typescript-eslint/ban-ts-comment */
// https://github.com/TehShrike/deepmerge
/* eslint-disable @typescript-eslint/no-use-before-define */
// @ts-nocheck
// eslint-disable-next-line @typescript-eslint/no-require-imports
import defaultIsMergeableObject from "is-mergeable-object";

function emptyTarget(val) {
    return Array.isArray(val) ? [] : {};
}

function cloneUnlessOtherwiseSpecified(value, options) {
    return options.clone !== false && options.isMergeableObject(value)
        ? deepmerge(emptyTarget(value), value, options)
        : value;
}

function defaultArrayMerge(target, source, options) {
    return target.concat(source).map(function (element) {
        return cloneUnlessOtherwiseSpecified(element, options);
    });
}

function getMergeFunction(key, options) {
    if (!options.customMerge) {
        return deepmerge;
    }
    const customMerge = options.customMerge(key);
    return typeof customMerge === "function" ? customMerge : deepmerge;
}

function getEnumerableOwnPropertySymbols(target) {
    return Object.getOwnPropertySymbols
        ? Object.getOwnPropertySymbols(target).filter(function (symbol) {
              return target.propertyIsEnumerable(symbol);
          })
        : [];
}

function getKeys(target) {
    return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
}

function propertyIsOnObject(object, property) {
    try {
        return property in object;
    } catch (_) {
        return false;
    }
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
    return (
        propertyIsOnObject(target, key) && // Properties are safe to merge if they don't exist in the target yet,
        !(
            // unsafe if they exist up the prototype chain,
            (Object.hasOwnProperty.call(target, key) && Object.propertyIsEnumerable.call(target, key))
        )
    ); // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
    const destination = {};
    if (options.isMergeableObject(target)) {
        getKeys(target).forEach(function (key) {
            destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
        });
    }
    getKeys(source).forEach(function (key) {
        if (propertyIsUnsafe(target, key)) {
            return;
        }

        if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
            destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
        } else {
            destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
        }
    });
    return destination;
}

function deepmerge(target, source, options = {}) {
    options = options || {};
    options.arrayMerge = options.arrayMerge || defaultArrayMerge;
    options.isMergeableObject = options.isMergeableObject || defaultIsMergeableObject;
    // cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
    // implementations can use it. The caller may not replace it.
    options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

    const sourceIsArray = Array.isArray(source);
    const targetIsArray = Array.isArray(target);
    const sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

    if (!sourceAndTargetTypesMatch) {
        return cloneUnlessOtherwiseSpecified(source, options);
    } else if (sourceIsArray) {
        return options.arrayMerge(target, source, options);
    } else {
        return mergeObject(target, source, options);
    }
}

export { deepmerge, deepmerge as deepMerge };

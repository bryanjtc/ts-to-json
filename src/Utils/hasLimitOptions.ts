import { Config } from "../Config";

export const hasLimitOptions = (config?: Config) => {
    if (!config) return;
<<<<<<< HEAD
<<<<<<< HEAD
    if (config.excludeRootProps && config.excludeRootProps.length) return true;
    if (config.excludeProps && config.excludeProps.length) return true;
=======
    if (config.skipParseRootPropTypes && config.skipParseRootPropTypes.length) return true;
    if (config.skipParsePropTypes && config.skipParsePropTypes.length) return true;
>>>>>>> 28974e24f7ccdf4e1df67d2a47c27e227c44b4a3
=======
    if (config.excludeRootProps && config.excludeRootProps.length) return true;
    if (config.excludeProps && config.excludeProps.length) return true;
>>>>>>> renaming
    if (config.includeProps && config.includeProps.length) return true;
    if (config.maxDepth) return true;
    return false;
};

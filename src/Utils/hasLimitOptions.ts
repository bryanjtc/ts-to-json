import { Config } from "../Config";

export const hasLimitOptions = (config?: Config) => {
    if (!config) return;
    if (config.skipParseRootPropTypes && config.skipParseRootPropTypes.length) return true;
    if (config.skipParsePropTypes && config.skipParsePropTypes.length) return true;
    if (config.includeProps && config.includeProps.length) return true;
    if (config.maxDepth) return true;
    return false;
};

import { Config } from "../Config";

export const hasLimitOptions = (config?: Config) => {
    if (!config) return;
    if (config.excludeRootProps && config.excludeRootProps.length) return true;
    if (config.excludeProps && config.excludeProps.length) return true;
    if (config.includeProps && config.includeProps.length) return true;
    if (config.maxDepth) return true;
    return false;
};

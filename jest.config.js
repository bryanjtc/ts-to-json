module.exports = {
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    moduleFileExtensions: ["js", "ts", "json"],
    testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/", "<rootDir>/build/"],
    coverageDirectory: "./coverage/",
    collectCoverage: false,
    testEnvironment: "node",
    transform: {
        ".*": "@swc/jest",
    },
    snapshotFormat: {
        escapeString: true,
        printBasicPrototype: true,
    },
};

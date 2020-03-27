import * as fs from "fs";
import * as path from "path";
import { getDirectories } from "./get-directories";

export const getFiles = (root: string) => {
    const dirs = getDirectories(root);
    const files = dirs.reduce((arr, dir) => {
        const allFiles = fs
            .readdirSync(dir, { withFileTypes: true })
            .filter((x) => x.isFile())
            .map((x) => path.join(root, x.name));
        arr = arr.concat(allFiles);
        return arr;
    }, [] as string[]);
    return files;
};

export const getFilesWithRelativePath = (root: string) => {
    const results = getFiles(root);
    return results.map((x) => x.replace(root, ""));
};

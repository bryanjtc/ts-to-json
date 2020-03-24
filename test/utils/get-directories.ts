import * as fs from "fs";
import * as path from "path";

export const getDirectories = (root: string, dirs: string[] = []) => {
    const results = fs
        .readdirSync(root, { withFileTypes: true })
        .filter(dir => dir.isDirectory())
        .map(dir => path.join(root, dir.name));
    if (!results.length) return dirs;
    results.forEach(dir => {
        dirs = getDirectories(dir, dirs);
    });
    dirs = dirs.concat(results);
    return dirs;
};

export const getRelativeDirectories = (root: string) => {
    const results = getDirectories(root);
    return results.map(x => x.replace(root, ""));
};

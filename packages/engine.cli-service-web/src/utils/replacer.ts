import { resolve, dirname, join } from "path";
import { existsSync } from "fs";

export const replacer = (originalPath, callingFileName, options) => {
  console.log("path to overrirde", callingFileName);
  const location = callingFileName.replace(options.j, "");
  const dir = dirname(location);
  const requested = resolve(dir, originalPath);
  const overridedPath = join(options.overrideModulesPath, requested);
  if (existsSync(overridedPath)) {
    return overridedPath;
  } else {
    return originalPath;
  }
};

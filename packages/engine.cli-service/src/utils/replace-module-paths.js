const path = require("path");
const fs = require("fs");
const paths = require("../utils/paths");

module.exports = function replaceImport(
  originalPath,
  callingFileName,
  options
) {
  const location = callingFileName.replace(paths.node_modules, "");
  const dir = path.dirname(location);
  const requested = path.resolve(dir, originalPath);
  const overridedPath = path.join(paths.modules, requested);
  if (fs.existsSync(overridedPath)) {
    return overridedPath;
  } else {
    return originalPath;
  }
};

import path from "path";
import fs from "fs";

export const getConfig = (state: any) => {
  const fileName = state.file.opts.filename;
  const loc = fileName.split(path.sep);

  loc.pop();
  let packageJson = null;
  while (!packageJson && loc.length > 0) {
    const curPath = loc.join(path.sep);
    const files = fs.readdirSync(curPath);
    const found = files.find(x => x === "package.json");
    if (found) {
      loc.push("package.json");
      const configPath = loc.join(path.sep);
      packageJson = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    }
    loc.pop();
  }

  if (!packageJson.engineConfig) {
    throw new Error(
      "Could not find engineConfig. Please add engineConfig to your package.json"
    );
  }

  return packageJson.engineConfig;
};

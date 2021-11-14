import findRoot from "find-root";
import { readFile } from "fs";
import { promisify } from "util";
import { resolve } from "path";
import { JSONSchemaForNPMPackageJsonFiles } from "@schemastore/package";

const pReadFile = promisify(readFile);

type props = {
  _findRoot: typeof findRoot;
  _resolve: typeof resolve;
  _readFile: typeof pReadFile;
  _cwd: typeof process.cwd;
  _dirname: typeof __dirname;
  config: Update<State["config"]>;
};

export const config: producer = async ({
  _findRoot = findRoot,
  _resolve = resolve,
  _readFile = pReadFile,
  _cwd = process.cwd,
  _dirname = __dirname,
  config = update.config,
}: props) => {
  const packageRoot = _findRoot(_dirname);
  const root = _findRoot(_resolve(packageRoot, ".."));
  const packageJson = _resolve(root, "package.json");
  const packageNodeModulesPath = _resolve(root, "node_modules");
  const replacerPath = _resolve(root, "dist", "utils", "replacer.js");
  const data = await _readFile(packageJson, "utf8");
  const result = JSON.parse(data) as JSONSchemaForNPMPackageJsonFiles;
  if (!result.name || !result.version) {
    throw new Error("name and version not found");
  }
  const commandPath = _cwd();
  const srcPath = _resolve(commandPath, "src");
  const entryPath = _resolve(srcPath, "index.tsx?");
  const overrideModulesPath = _resolve(srcPath, "node_modules_overrides");
  const nodeModulesPath = _resolve(commandPath, "node_modules");
  const publicPath = _resolve(commandPath, "public");
  const distPath = _resolve(commandPath, "dist");
  const publicIndexPath = _resolve(publicPath, "index.html");
  const tailwindConfigPath = _resolve(commandPath, "tailwind.config.js");
  config.set({
    name: result.name,
    version: result.version,
    proxy: result.proxy,
    webpackPublicPath: result.publicPath,
    packagePath: root,
    commandPath,
    srcPath,
    entryPath,
    distPath,
    publicPath,
    publicIndexPath,
    nodeModulesPath,
    overrideModulesPath,
    replacerPath,
    packageNodeModulesPath,
    tailwindConfigPath,
  });
};

import findRoot from "find-root";
import webpack from "webpack";
import { readFile, existsSync } from "fs";
import { promisify } from "util";
import { resolve } from "path";
import { JSONSchemaForNPMPackageJsonFiles } from "@schemastore/package";
import { EngineConfig } from "../types";

const pReadFile = promisify(readFile);

type props = {
  _findRoot: typeof findRoot;
  startPath: string;
  trigger: State["triggers"]["config"];
  _resolve: typeof resolve;
  _readFile: typeof pReadFile;
  _cwd: typeof process.cwd;
  _dirname: typeof __dirname;
  config: Update<State["config"]>;
};

export const config: producer = async ({
  trigger = observe.triggers.config,
  startPath = arg.trigger.path,
  _findRoot = findRoot,
  _resolve = resolve,
  _readFile = pReadFile,
  _cwd = process.cwd,
  _dirname = __dirname,
  config = update.config,
}: props) => {
  if (!trigger) {
    return;
  }
  const packageRoot = _findRoot(_dirname);
  const root = _findRoot(_resolve(packageRoot, ".."));
  const packageJson = _resolve(startPath || root, "package.json");
  const packageNodeModulesPath = _resolve(root, "node_modules");
  const replacerPath = _resolve(root, "dist", "utils", "replacer.js");
  const data = await _readFile(packageJson, "utf8");
  const result = JSON.parse(data) as JSONSchemaForNPMPackageJsonFiles;
  const commandPath = startPath || _cwd();
  const srcPath = _resolve(commandPath, "src");
  const entryPath = _resolve(srcPath, "index.tsx?");
  const overrideModulesPath = _resolve(srcPath, "node_modules_overrides");
  const nodeModulesPath = _resolve(commandPath, "node_modules");
  const publicPath = _resolve(commandPath, "public");
  const distPath = _resolve(commandPath, "dist");
  const publicIndexPath = _resolve(publicPath, "index.ejs");
  const configPath = _resolve(commandPath, "engine.config.js");

  let engineConfig: EngineConfig = {};
  if (existsSync(configPath)) {
    engineConfig = require(configPath) || {};
    //TODO: check if the engine config is malformed
  }
  const name = engineConfig.name || result.name || "unknown-app";
  const exportAppStructure =
    engineConfig.exportAppStructure === true ? true : false;

  config.set({
    name,
    version: result.version || "unknown-version",
    configPath,
    exportAppStructure,
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
  });
};

import findRoot from "find-root";
import { readFile } from "fs";
import { promisify } from "util";
import { resolve } from "path";
import { JSONSchemaForNPMPackageJsonFiles } from "@schemastore/package";
import { CreateTemplateTarget } from "../state";

const pReadFile = promisify(readFile);

type props = {
  _findRoot: typeof findRoot;
  _resolve: typeof resolve;
  _readFile: typeof pReadFile;
  _cwd: typeof process.cwd;
  config: Update<State["config"]>;
};

export const config: producer = async ({
  _findRoot = findRoot,
  _resolve = resolve,
  _readFile = pReadFile,
  _cwd = process.cwd,
  config = update.config,
}: props) => {
  const root = _findRoot(__dirname);
  const packageJson = _resolve(root, "package.json");
  const data = await _readFile(packageJson, "utf8");
  const result = JSON.parse(data) as JSONSchemaForNPMPackageJsonFiles;
  if (!result.name || !result.version) {
    throw new Error("name and version not found");
  }
  config.set({
    name: result.name,
    version: result.version,
    packagePath: root,
    commandPath: _cwd(),
    scripts: {
      [CreateTemplateTarget.NODE]: {
        target: CreateTemplateTarget.NODE,
        packageName: "@c11/engine.cli-service-node",
        binName: "engine-node-scripts",
        version:
          (result.devDependencies &&
            result.devDependencies["@c11/engine.cli-service-node"]) ||
          "",
      },
      [CreateTemplateTarget.WEB]: {
        target: CreateTemplateTarget.WEB,
        packageName: "@c11/engine.cli-service-web",
        binName: "engine-web-scripts",
        version:
          (result.devDependencies &&
            result.devDependencies["@c11/engine.cli-service-web"]) ||
          "",
      },
    },
  });
};

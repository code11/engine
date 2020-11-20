import { writeFile } from "fs";
import { promisify } from "util";
import { JSONSchemaForNPMPackageJsonFiles } from "@schemastore/package";

export const writePackageJson: producer = async ({
  _writeFile = promisify(writeFile),
  target = observe.create.templateConfig.target,
  packageConfig = get.create.templateConfig.package,
  getScripts = get.config.scripts[arg.target],
  appName = get.create.config.appName,
  getTargetPath = get.create.config.targetPackageJsonPath,
  flag = update.create.flags.isPackageJsonReady,
}) => {
  if (!target) {
    return;
  }

  const scripts = getScripts.value();
  const name = appName.value();
  const targetPath = getTargetPath.value();

  console.log("scripts", scripts);

  if (!scripts || !name || !targetPath) {
    throw new Error("Missing values");
  }

  const packageJson: JSONSchemaForNPMPackageJsonFiles = {
    name,
    private: true,
    version: "1.0.0",
    scripts: {
      start: `${scripts.binName} start`,
      test: `${scripts.binName} test`,
      build: `${scripts.binName} build`,
    },
    devDependencies: {
      [scripts.packageName]: scripts.version,
    },
    dependencies: {
      ...packageConfig.dependencies,
    },
  };

  await _writeFile(targetPath, JSON.stringify(packageJson, null, " "), "utf-8");
  flag.set(true);
};

import { writeFile } from "fs";
import { promisify } from "util";
import { JSONSchemaForNPMPackageJsonFiles } from "@schemastore/package";
import { CreateTemplateTarget } from "../state";
import { performance } from "perf_hooks";

const pWriteFile = promisify(writeFile);

type props = {
  _writeFile: typeof pWriteFile;
  _now: number;
  isTemplateConfigReady: State["create"]["flags"]["isTemplateConfigReady"];
  isTemplateCopyReady: State["create"]["flags"]["isTemplateCopyReady"];
  target: State["create"]["templateConfig"]["target"];
  packageConfig: Get<State["create"]["templateConfig"]["package"]>;
  getScripts: Get<State["config"]["scripts"][CreateTemplateTarget]>;
  appName: Get<State["create"]["config"]["appName"]>;
  getTargetPath: Get<State["create"]["config"]["targetPackageJsonPath"]>;
  flag: Update<State["create"]["flags"]["isPackageJsonReady"]>;
};

export const writePackageJson: producer = async ({
  _writeFile = pWriteFile,
  _now,
  isTemplateCopyReady = observe.create.flags.isTemplateCopyReady,
  isTemplateConfigReady = observe.create.flags.isTemplateConfigReady,
  target = observe.create.templateConfig.target,
  packageConfig = get.create.templateConfig.package,
  getScripts = get.config.scripts[arg.target],
  appName = get.create.config.appName,
  getTargetPath = get.create.config.targetPackageJsonPath,
  flag = update.create.flags.isPackageJsonReady,
}: props) => {
  if (!isTemplateCopyReady || !isTemplateConfigReady || !target) {
    return;
  }

  const scripts = getScripts.value();
  const name = appName.value();
  const targetPath = getTargetPath.value();
  const config = packageConfig.value();

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
      ...config.devDependencies,
    },
    dependencies: {
      ...config.dependencies,
    },
  };

  await _writeFile(targetPath, JSON.stringify(packageJson, null, " "), "utf-8");
  flag.set(_now());
};

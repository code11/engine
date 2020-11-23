import { resolve } from "path";

type props = {
  _resolve: typeof resolve;
  commandPath: State["config"]["commandPath"];
  appName: State["create"]["config"]["appName"];
  templateName: State["create"]["config"]["templateName"];
  config: Update<State["create"]["config"]>;
};

export const config: producer = ({
  _resolve = resolve,
  commandPath = observe.config.commandPath,
  appName = observe.create.config.appName,
  templateName = observe.create.config.templateName,
  config = update.create.config,
}: props) => {
  if (!commandPath || !appName || !templateName) {
    return;
  }
  const targetPath = _resolve(commandPath, appName);
  const targetPackageJsonPath = _resolve(targetPath, "package.json");
  const targetTsConfigPath = _resolve(targetPath, "tsconfig.json");
  const targetGitIgnorePath = _resolve(targetPath, ".gitignore");
  const tmpPath = _resolve(targetPath, ".tmp");
  const templatePath = _resolve(tmpPath, templateName);
  const templateSandboxPath = _resolve(templatePath, "template");
  const templateConfigFilePath = _resolve(templatePath, "template.json");
  config.merge({
    targetPath,
    targetPackageJsonPath,
    tmpPath,
    templatePath,
    templateSandboxPath,
    templateConfigFilePath,
    targetTsConfigPath,
    targetGitIgnorePath,
  });
};

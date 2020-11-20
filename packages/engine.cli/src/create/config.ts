import { resolve } from "path";

export const config: producer = ({
  _resolve = resolve,
  commandPath = observe.config.commandPath,
  appName = observe.create.config.appName,
  templateName = observe.create.config.templateName,
  config = update.create.config,
}) => {
  if (!commandPath || !appName || !templateName) {
    return;
  }
  const targetPath = _resolve(commandPath, appName);
  const targetPackageJsonPath = _resolve(targetPath, "package.json");
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
  });
};

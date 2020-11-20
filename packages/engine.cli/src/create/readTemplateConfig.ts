import { readFile } from "fs";
import { promisify } from "util";

enum CreateTemplateTarget {
  NODE = "node",
  WEB = "web",
}

export const readTemplateConfig: producer = async ({
  _readFile = promisify(readFile),
  isReady = observe.create.flags.isTemplateDownloadReady,
  path = get.create.config.templateConfigFilePath,
  config = update.create.templateConfig,
}) => {
  if (!isReady) {
    return;
  }

  const configFile = await _readFile(path.value(), "utf-8");
  const result = JSON.parse(configFile) as State["create"]["templateConfig"];
  config.set({
    package: result.package || {},
    target: result.target || CreateTemplateTarget.WEB,
  });
};

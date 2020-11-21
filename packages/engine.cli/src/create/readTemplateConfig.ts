import { readFile } from "fs";
import { promisify } from "util";

enum CreateTemplateTarget {
  NODE = "node",
  WEB = "web",
}
const pReadFile = promisify(readFile);

type props = {
  _readFile: typeof pReadFile;
  isReady: State["create"]["flags"]["isTemplateDownloadReady"];
  path: Get<State["create"]["config"]["templateConfigFilePath"]>;
  config: Update<State["create"]["templateConfig"]>;
};

export const readTemplateConfig: producer = async ({
  _readFile = pReadFile,
  isReady = observe.create.flags.isTemplateDownloadReady,
  path = get.create.config.templateConfigFilePath,
  config = update.create.templateConfig,
}: props) => {
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

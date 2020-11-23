import { readFile } from "fs";
import { promisify } from "util";
import { performance } from "perf_hooks";

enum CreateTemplateTarget {
  NODE = "node",
  WEB = "web",
}
const pReadFile = promisify(readFile);

type props = {
  _readFile: typeof pReadFile;
  _now: typeof performance.now;
  isReady: State["create"]["flags"]["isTemplateDownloadReady"];
  path: Get<State["create"]["config"]["templateConfigFilePath"]>;
  config: Update<State["create"]["templateConfig"]>;
  flag: Update<State["create"]["flags"]["isTemplateConfigReady"]>;
};

export const readTemplateConfig: producer = async ({
  _readFile = pReadFile,
  _now = performance.now,
  isReady = observe.create.flags.isTemplateDownloadReady,
  path = get.create.config.templateConfigFilePath,
  config = update.create.templateConfig,
  flag = update.create.flags.isTemplateConfigReady,
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
  flag.set(_now());
};

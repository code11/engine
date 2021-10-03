import ncp from "ncp";
import { promisify } from "util";
import { performance } from "perf_hooks";

const pNcp = promisify(ncp);

type props = {
  _ncp: typeof pNcp;
  _now: number;
  isReady: State["create"]["flags"]["isTemplateDownloadReady"];
  sandboxPath: State["create"]["config"]["templateSandboxPath"];
  targetPath: State["create"]["config"]["targetPath"];
  flag: Update<State["create"]["flags"]["isTemplateCopyReady"]>;
};

export const copyTemplate: producer = async ({
  _ncp = pNcp,
  _now,
  isReady = observe.create.flags.isTemplateDownloadReady,
  sandboxPath = observe.create.config.templateSandboxPath,
  targetPath = observe.create.config.targetPath,
  flag = update.create.flags.isTemplateCopyReady,
}: props) => {
  if (!isReady || !sandboxPath || !targetPath) {
    return;
  }

  targetPath;

  await _ncp(sandboxPath, targetPath);
  flag.set(_now());
};

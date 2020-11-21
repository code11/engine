import ncp from "ncp";
import { promisify } from "util";
import { rename } from "fs";
import { resolve } from "path";

const pRename = promisify(rename);
const pNcp = promisify(ncp);

type props = {
  _rename: typeof pRename;
  _ncp: typeof pNcp;
  _resolve: typeof resolve;
  isReady: State["create"]["flags"]["isTemplateDownloadReady"];
  sandboxPath: State["create"]["config"]["templateSandboxPath"];
  targetPath: State["create"]["config"]["targetPath"];
  flag: Update<State["create"]["flags"]["isTemplateCopyReady"]>;
};

export const copyTemplate: producer = async ({
  _rename = pRename,
  _ncp = pNcp,
  _resolve = resolve,
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
  await _rename(
    _resolve(targetPath, "gitignore"),
    _resolve(targetPath, ".gitignore")
  );
  flag.set(true);
};

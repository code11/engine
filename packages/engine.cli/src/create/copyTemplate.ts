import ncp from "ncp";
import { promisify } from "util";
import { rename } from "fs";
import { resolve } from "path";

export const copyTemplate: producer = async ({
  _rename = promisify(rename),
  _ncp = promisify(ncp),
  _resolve = resolve,
  isReady = observe.create.flags.isTemplateDownloadReady,
  sandboxPath = observe.create.config.templateSandboxPath,
  targetPath = observe.create.config.targetPath,
  flag = update.create.flags.isTemplateCopyReady,
}) => {
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

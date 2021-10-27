import { mkdir, readdir } from "fs";
import { promisify } from "util";
import { performance } from "perf_hooks";

const pReaddir = promisify(readdir);
const pMkdir = promisify(mkdir);

type props = {
  _readdir: typeof pReaddir;
  _mkdir: typeof pMkdir;
  _now: () => number;
  targetPath: State["create"]["config"]["targetPath"];
  flag: Update<State["create"]["flags"]["isAppFolderReady"]>;
};

export const prepareAppFolder: producer = async ({
  _readdir = pReaddir,
  _mkdir = pMkdir,
  _now,
  targetPath = observe.create.config.targetPath,
  flag = update.create.flags.isAppFolderReady,
}: props) => {
  if (!targetPath) {
    return;
  }

  try {
    await _mkdir(targetPath);
  } catch (e) {
    if (e.code === "EEXIST") {
      const files = await _readdir(targetPath);
      if (files.length !== 0) {
        throw new Error(`Directory ${targetPath} is not empty`);
      }
    }
  }

  flag.set(_now());
};

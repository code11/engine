import { mkdir, readdir } from "fs";
import { promisify } from "util";

const pReaddir = promisify(readdir);
const pMkdir = promisify(mkdir);

type props = {
  _readdir: typeof pReaddir;
  _mkdir: typeof pMkdir;
  targetPath: State["create"]["config"]["targetPath"];
  isAppFolderReady: Update<State["create"]["flags"]["isAppFolderReady"]>;
};

export const prepareAppFolder: producer = async ({
  _readdir = pReaddir,
  _mkdir = pMkdir,
  targetPath = observe.create.config.targetPath,
  isAppFolderReady = update.create.flags.isAppFolderReady,
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

  isAppFolderReady.set(true);
};

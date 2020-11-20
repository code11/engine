import { mkdir, readdir } from "fs";
import { promisify } from "util";

export const prepareAppFolder: producer = async ({
  _readdir = promisify(readdir),
  _mkdir = promisify(mkdir),
  targetPath = observe.create.config.targetPath,
  isAppFolderReady = update.create.flags.isAppFolderReady,
}) => {
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

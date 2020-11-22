import { rmdir } from "fs";
import { promisify } from "util";

const pRmdir = promisify(rmdir);

type props = {
  _rmdir: typeof pRmdir;
  isReady: State["create"]["flags"]["isDependencyInstallReady"];
  getTmpPath: Get<State["create"]["config"]["tmpPath"]>;
};

export const cleanup: producer = async ({
  _rmdir = pRmdir,
  isReady = observe.create.flags.isDependencyInstallReady,
  getTmpPath = get.create.config.tmpPath,
}: props) => {
  if (!isReady) {
    return;
  }
  const tmpPath = getTmpPath.value();
  if (!tmpPath) {
    throw new Error("tmpPath missing");
  }

  await _rmdir(tmpPath, { recursive: true });
  console.log("clean up done");
};

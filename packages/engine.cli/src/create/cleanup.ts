import { rmdir } from "fs";
import { promisify } from "util";
import { performance } from "perf_hooks";

const pRmdir = promisify(rmdir);

type props = {
  _rmdir: typeof pRmdir;
  _now: typeof performance.now;
  isSetupReady: State["create"]["flags"]["isSetupReady"];
  getTmpPath: Get<State["create"]["config"]["tmpPath"]>;
  flag: Update<State["create"]["flags"]["isCleanupReady"]>;
};

export const cleanup: producer = async ({
  _rmdir = pRmdir,
  _now = performance.now,
  isSetupReady = observe.create.flags.isSetupReady,
  getTmpPath = get.create.config.tmpPath,
  flag = update.create.flags.isCleanupReady,
}: props) => {
  if (!isSetupReady) {
    return;
  }
  const tmpPath = getTmpPath.value();
  if (!tmpPath) {
    throw new Error("tmpPath missing");
  }

  await _rmdir(tmpPath, { recursive: true });
  flag.set(_now());
};

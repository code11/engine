import { spawn } from "child_process";
import { performance } from "perf_hooks";

type props = {
  _spawn: typeof spawn;
  _now: typeof performance.now;
  isReady: State["create"]["flags"]["isPackageJsonReady"];
  getTargetPath: Get<State["create"]["config"]["targetPath"]>;
  flag: Update<State["create"]["flags"]["isDependencyInstallReady"]>;
};

export const installDependencies: producer = async ({
  _spawn = spawn,
  _now = performance.now,
  isReady = observe.create.flags.isPackageJsonReady,
  getTargetPath = get.create.config.targetPath,
  flag = update.create.flags.isDependencyInstallReady,
}: props) => {
  if (!isReady) {
    return;
  }

  const targetPath = getTargetPath.value();
  if (!targetPath) {
    throw new Error("Missing values");
  }

  const install = _spawn("yarn", ["install"], {
    cwd: targetPath,
  });

  install.stdout.on("data", (data) => {
    // console.log(`stdout: ${data}`);
  });

  install.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  install.on("close", (code) => {
    if (code !== 0) {
      throw new Error("Could not install dependencies");
    }
    flag.set(_now());
  });
};

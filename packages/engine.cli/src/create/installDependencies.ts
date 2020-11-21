import { spawn } from "child_process";
// import { promisify } from "util";

type props = {
  _spawn: typeof spawn;
  isReady: State["create"]["flags"]["isPackageJsonReady"];
  getTargetPath: Get<State["create"]["config"]["targetPath"]>;
  flag: Update<State["create"]["flags"]["isDependencyInstallReady"]>;
};

export const installDependencies: producer = async ({
  _spawn = spawn,
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

  console.log(targetPath);

  const install = _spawn("npm", ["install"], {
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
    flag.set(true);
  });

  // flag.set(true);
};

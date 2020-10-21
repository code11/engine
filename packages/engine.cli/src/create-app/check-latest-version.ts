const chalk = require("chalk");
const { logStep, logWarning } = require("../utils/logger");
const { spawnSync } = require("child_process");
const { eq, lt, gt } = require("semver");

const pkg = require("../../package.json");

export = () => {
  const currentVersion = pkg.version;
  const latestVersionOut = spawnSync(
    "npm",
    ["show", "@c11/engine.cli", "version"],
    {
      encoding: "utf-8",
    }
  );
  const latestVersion = latestVersionOut.stdout
    .replace("\n", "")
    .replace("\r\n", "");
    
    console.log('latestVersion:',latestVersion)

  logStep(`Current version ${chalk.yellowBright(currentVersion)}`);

  if (eq(currentVersion, latestVersion)) {
    return;
  }

  if (lt(currentVersion, latestVersion)) {
    logWarning(
      `Latest version is ${chalk.yellowBright(
        latestVersion
      )}. Please update your engine cli version`
    );
    logWarning(
      `In order to upgrade, please run ${chalk.yellowBright(
        "npm install -g @c11/engine.cli"
      )} in a terminal window`
    );
    return;
  }

  if (gt(currentVersion, latestVersion)) {
    logWarning(
      `This really shouldn't happen... current version ${chalk.yellowBright(
        currentVersion
      )} is greater than latest ${chalk.yellowBright(latestVersion)}`
    );
    return;
  }
};

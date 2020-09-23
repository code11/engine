const chalk = require("chalk");
const { spawnSync } = require("child_process");
const { eq, lt, gt } = require("semver");

const pkg = require("../package.json");

module.exports = () => {
  const currentVersion = pkg.version;
  const latestVersionOut = spawnSync(
    "npm",
    ["show", "@c11/utils.create-engine-app", "version"],
    {
      encoding: "utf-8",
    }
  );
  const latestVersion = latestVersionOut.stdout
    .replace("\n", "")
    .replace("\r\n", "");

  logStep(`Current version ${chalk.yellowBright(currentVersion)}`);

  if (eq(currentVersion, latestVersion)) {
    return;
  }

  if (lt(currentVersion, latestVersion)) {
    logWarning(
      `Latest version is ${chalk.yellowBright(
        latestVersion
      )}. Please update your create-react-app version`
    );
    logWarning(
      `In order to upgrade, please run ${chalk.yellowBright(
        "npm install -g @c11/utils.create-engine-app"
      )} in a terminal window`
    );
    console.log();
    return;
  }

  if (gt(currentVersion, latestVersion)) {
    logWarning(
      `This really shouldn't happen... current version ${chalk.yellowBright(
        currentVersion
      )} is greater than latest ${chalk.yellowBright(latestVersion)}`
    );
    console.log();
    return;
  }
};

function logStep(text) {
  console.log(chalk.cyanBright(`🔨  ${text}`));
}

function logWarning(text) {
  console.log(chalk.redBright(`📢  ${text}`));
}

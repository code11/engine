import { dirname } from "path";

const chalk = require("chalk");
const { logStep } = require("../utils/logger");
const { relativeToCWD } = require("../utils/paths");
const checkLatestVersion = require("./check-latest-version");
const ensureAppDirectory = require("./ensure-app-directory");
const instantiateTemplate = require("./instantiate-template");
const createPackageJson = require("./create-package-json");
const installDependencies = require("./install-dependencies");
const cleanup = require("./cleanup");

export = async (dirName:string, templateName:string) => {
  const name = dirName;
  const template = templateName;

  const paths = {
    app: relativeToCWD(name),
  };
  checkLatestVersion();
  logStep(
    `🔨  Creating application ${chalk.yellowBright(
      name
    )} using template ${chalk.yellowBright(template)}`
  );
  logStep(
    `🔨  Application target directory is ${chalk.yellowBright(paths.app)}`
  );

  try {
    ensureAppDirectory({ target: paths.app });

    await instantiateTemplate({ target: paths.app, template });

    const replacements = {
      appName: name,
    };
    createPackageJson({ target: paths.app, replacements });

    installDependencies({ target: paths.app });

    cleanup({ target: paths.app });

    logStep(
      `🔨  Succesfully created app ${chalk.yellowBright(
        name
      )} using template ${chalk.yellowBright(template)}`
    );
    logStep(`🔨  Resulted directory ${chalk.yellowBright(paths.app)}`);
    console.log();

    logStep(`Quickstart`);
    logStep(`
    cd ${paths.app}
    npm start
    `);

    logStep(`Thank you for using our app generator and happy coding`);
  } catch (e) {}
};

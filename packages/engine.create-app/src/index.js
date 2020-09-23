const arguments = require("yargs");
const chalk = require("chalk");

const pkg = require("../package.json");
const { relativeToCWD } = require("../paths");

const checkLatestVersion = require("./check-latest-version");
const ensureAppDirectory = require("./ensure-app-directory");
const instantiateTemplate = require("./instantiate-template");
const createPackageJson = require("./create-package-json");
const installDependencies = require("./install-dependencies");
const cleanup = require("./cleanup");

arguments.option("t", {
  alias: "template",
  default: "app",
  describe:
    "If the template name starts with @, then then the template package used will match the option value\nOtherwise, the template package used will be @c11/template.<template>",
});

arguments.demandCommand(
  1,
  `
  ${chalk.bold.redBright(
    "You must supply the application name as command argument, see below"
  )}
  ${chalk.bold.cyan("Usage:   create-engine-app <app-name>")}
  ${chalk.bold.cyan("Example: create-engine-app myApp")}
  `
);
arguments.recommendCommands();

module.exports = async () => {
  console.log('step 1')
  const args = arguments.parse();

  const name = args._[0];
  const template = args.template;

  const paths = {
    app: relativeToCWD(name),
  };

  logStep(`🔨  create-engine-app using package ${pkg.name}`);

  checkLatestVersion();

  logStep(
    `🔨  Creating application ${chalk.yellowBright(
      name
    )} using template ${chalk.yellowBright(template)}`
  );
  logStep(
    `🔨  Application target directory is ${chalk.yellowBright(paths.app)}`
  );
  console.log('step 2');

  try {
    ensureAppDirectory({ target: paths.app });
    console.log();

    await instantiateTemplate({ target: paths.app, template });
    console.log();

    const replacements = {
      appName: name,
    };
    createPackageJson({ target: paths.app, replacements });
    console.log();

    installDependencies({ target: paths.app });
    console.log();

    cleanup({ target: paths.app });
    console.log();

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
  } catch (e) {
    console.error('eroare:',e);
  }
};

function logStep(text) {
  console.log(chalk.cyanBright(text));
}

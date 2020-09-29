const chalk = require("chalk");
const { existsSync, mkdirSync } = require("fs");

module.exports = ({ target }) => {
  logStep(`Checking path ${chalk.yellowBright(target)}`);

  if (existsSync(target)) {
    logWarning(`Directory ${target} exists. Please remove it before the installation`);
    process.exit(1);
  }

  logStep(`Creating directory ${chalk.yellowBright(target)}`);
  mkdirSync(target);
};

function logStep(text) {
  console.log(chalk.cyanBright(`🗃   ${text}`));
}

function logWarning(text) {
  console.log(chalk.redBright(`📢  ${text}`));
}

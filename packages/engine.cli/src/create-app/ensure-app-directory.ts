const chalk = require("chalk");
const { logStep, logWarning } = require("../utils/logger");
const { existsSync, mkdirSync } = require("fs");

export = ({ target }:{target:any}) => {
  logStep(`Checking path ${chalk.yellowBright(target)}`);

  if (existsSync(target)) {
    logWarning(`Directory ${target} exists. Please remove it before the installation`);
    process.exit(1);
  }

  logStep(`Creating directory ${chalk.yellowBright(target)}`);
  mkdirSync(target);
};

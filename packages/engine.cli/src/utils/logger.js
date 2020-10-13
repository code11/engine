const chalk = require("chalk");

function logStep(text) {
  console.log(chalk.cyanBright(`🔨  ${text}`));
}

function logWarning(text) {
  console.log(chalk.redBright(`📢  ${text}`));
}

module.exports = {
  logStep,
  logWarning
}
const chalk = require("chalk");
const { unlinkSync } = require("fs");
const { resolve } = require("path");

module.exports = ({ target }) => {
  logStep("Cleaning up unnecessary files...");
  const filesToRemove = [resolve(target, "package.template.json")];

  filesToRemove.forEach((file) => {
    unlinkSync(file);
  });
  logStep(`Cleanup done succesfully`);
};

function logStep(text) {
  console.log(chalk.cyanBright(`🗑   ${text}`));
}

function logWarning(text) {
  console.log(chalk.redBright(`📢  ${text}`));
}

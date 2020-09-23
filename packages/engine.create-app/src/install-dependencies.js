const chalk = require('chalk');
const { spawnSync } = require('child_process');

module.exports = ({ target }) => {
  logStep(`Installing dependencies, hang on...`);

  logStep(`Executing npm install, this may take a while`);
  spawnSync('npm', ['install'], {
    cwd: target,
    stdio: 'ignore'
  });

  logStep(`Packages installed succesfully`);
}

function logStep(text) {
  console.log(chalk.cyanBright(`🔌  ${text}`));
}

function logWarning(text) {
  console.log(chalk.redBright(`📢  ${text}`));
}

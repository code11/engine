const chalk = require('chalk');
const ncp = require('ncp');
const fs = require('fs')
const { spawnSync } = require('child_process');
const { existsSync } = require('fs');
const { resolve } = require('path');

module.exports = async ({ target, template }) => {
  const packageName = getTemplatePackageName(template);
  logStep(`Instantiating template ${chalk.yellowBright(packageName)} in the ${chalk.yellowBright(target)} directory`);

  logStep(`Installing template package ${chalk.yellowBright(packageName)}`);

  const packageInit = JSON.stringify({}) // macOS requires package.json to be initialised
  fs.writeFileSync(`${target}/package.json`, packageInit)

  spawnSync(`npm`, ['install', packageName], { cwd: target, stdio: 'ignore' });
  const templatePackageDir = resolve(target, 'node_modules', packageName);
  if (!existsSync(templatePackageDir)) {
    logWarning(`Template package ${chalk.cyanBright(packageName)} not found at location ${chalk.cyanBright(templatePackageDir)}`);
    process.exit(1);
  }

  const templateDir = resolve(templatePackageDir, 'template');

  logStep(`Copying template files from ${chalk.yellowBright(templateDir)}`);
  return new Promise((res, rej) => {
    ncp(templateDir, target, (err) => {
      if (err) return rej(err);
      logStep(`Template files succesfully copied to ${target}`);
      logStep(`Template succesfully instantiated!`);
      return res();
    });
  });
};

function getTemplatePackageName(name) {
  if (!name) return `@c11/engine.templates-app`;
  if (name.startsWith("@")) return name;

  return `@c11/engine.templates-${name}`;
}

function logStep(text) {
  console.log(chalk.cyanBright(`📑  ${text}`));
}

function logWarning(text) {
  console.log(chalk.redBright(`📢  ${text}`));
}

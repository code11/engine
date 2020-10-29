const chalk = require("chalk");
const { logStep } = require("../utils/logger");
const { readFileSync, writeFileSync } = require("fs");
const { EOL } = require("os");
const { resolve } = require("path");

export = ({ replacements, target }: { replacements: any; target: any }) => {
  logStep(`Generating package.json...`);

  const packageJsonPath = resolve(target, "package.json");
  const packageJsonTemplatePath = resolve(target, "package.template.json");

  logStep(
    `Reading package.json template from ${chalk.yellowBright(
      packageJsonTemplatePath
    )}`
  );
  const packageJsonTemplate = readFileSync(packageJsonTemplatePath, "utf-8");

  logStep(`Replacing package.json template values`);
  const packageJson = Object.keys(replacements)
    .reduce((acc, curr) => {
      return acc.replace(`{{${curr}}}`, replacements[curr]);
    }, packageJsonTemplate)
    .concat(EOL);

  logStep(
    `Flushing package.json contents to file ${chalk.yellowBright(
      packageJsonPath
    )}`
  );
  writeFileSync(packageJsonPath, packageJson);

  logStep(`Success, package.json file generated succesfully`);
};

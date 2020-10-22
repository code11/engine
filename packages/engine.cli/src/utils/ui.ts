const chalk = require("chalk");

const formatStep = (text) => chalk.cyanBright(text);
const formatParameter = (text) => chalk.yellowBright(text);

export = {
  formatStep, formatParameter
}

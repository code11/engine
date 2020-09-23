const arguments = require("./utils/arguments");
const scripts = require("./scripts");

const command = arguments._[0];

if (!Object.keys(scripts).some((key) => key === command)) {
  console.log(`Command ${command} not supported`);
  console.log(`Available commands: ${Object.keys(scripts).join(", ")}`);
  throw new Error("Command not supported");
}

if (scripts[command]) {
  scripts[command](arguments);
}

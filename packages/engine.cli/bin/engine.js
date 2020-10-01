#!/usr/bin/env node

const program = require("commander");

program
  .version(`engine.cli ${require("../package").version}`)
  .usage("<command> [options]");

program
  .command("create <app-name>")
  .description("create a new project powered by engine.cli")
  .option(
    "-t, --template <template>",
    "If the template name starts with @, then then the template package used will match the option value\nOtherwise, the template package used will be @c11/template.<template>",
    "app"
  )
  .action((name, cmd) => {
    require("../src/create-app")(name, cleanArgs(cmd).template);
  });
program
  .command("build")
  .description("build your app")
  .action((cmd) => {
    require("../src/create-app-scripts/scripts")(cmd._name);
  });
program
  .command("clean")
  .description("remove compiled files")
  .action((cmd) => {
    require("../src/create-app-scripts/scripts")(cmd._name);
  });
program
  .command("lint")
  .description("Lint source files using eslint")
  .action((cmd) => {
    require("../src/create-app-scripts/scripts")(cmd._name);
  });
program
  .command("serve")
  .description("Serve the latest build")
  .action((cmd) => {
    require("../src/create-app-scripts/scripts")(cmd._name);
  });
program
  .command("start")
  .description("Start a development server")
  .action((cmd) => {
    require("../src/create-app-scripts/scripts")(cmd._name);
  });
program
  .command("test")
  .description("Execute unit tests using jest")
  .action((cmd) => {
    require("../src/create-app-scripts/scripts")(cmd._name);
  });

program.parse(process.argv);

function cleanArgs(cmd) {
  const args = {};
  cmd.options.forEach((o) => {
    const key = camelize(o.long.replace(/^--/, ""));
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== "function" && typeof cmd[key] !== "undefined") {
      args[key] = cmd[key];
    }
  });
  return args;
}

function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
}

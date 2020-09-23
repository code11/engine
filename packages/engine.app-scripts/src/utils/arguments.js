const arguments = require("yargs");

arguments.command({
  command: "build",
  desc: "Build your app",
});

arguments.command({
  command: "clean",
  desc: "Remove compiled files",
});

arguments.command({
  command: "lint",
  desc: "Lint source files using eslint",
});

arguments.command({
  command: "serve",
  desc: "Serve the latest build",
});

arguments.command({
  command: "start",
  desc: "Start a development server",
});

arguments.command({
  command: "test",
  desc: "Execute unit tests using jest",
});

arguments.demandCommand(1);
arguments.recommendCommands();

arguments.usage("c11-app-scripts <command>");

module.exports = arguments.parse();

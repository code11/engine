import commander from "commander";
import { performance } from "perf_hooks";

type props = {
  _commander: typeof commander;
  version: State["config"]["version"];
  start: Update<State["start"]["triggers"]["init"]>;
  build: Update<State["build"]["triggers"]["init"]>;
};

export const command: producer = ({
  _commander = commander,
  version = observe.config.version,
  start = update.start.triggers.init,
  build = update.build.triggers.init,
}: props) => {
  if (!version) {
    return;
  }

  _commander.version(version).usage("<command> [options]");

  _commander
    .command("start")
    .description("Start the application")
    .action((cmd: commander.Command) => {
      start.set({
        opts: (cmd && cmd.opts && cmd.opts()) || {},
        timestamp: performance.now(),
      });
    });

  _commander
    .command("build")
    .description("Build the application")
    .action((cmd: commander.Command) => {
      build.set({
        opts: (cmd && cmd.opts && cmd.opts()) || {},
        timestamp: performance.now(),
      });
    });

  _commander.parse(process.argv);
};

import commander from "commander";

type props = {
  _now: () => number;
  _commander: typeof commander;
  version: State["config"]["version"];
  start: Update<State["start"]["triggers"]["init"]>;
  build: Update<State["build"]["triggers"]["init"]>;
};

export const command: producer = ({
  _now,
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
      const trigger = {
        opts: (cmd && cmd.opts && cmd.opts()) || {},
        timestamp: _now(),
      };
      start.set(trigger);
    });

  _commander
    .command("build")
    .description("Build the application")
    .action((cmd: commander.Command) => {
      build.set({
        opts: (cmd && cmd.opts && cmd.opts()) || {},
        timestamp: _now(),
      });
    });

  _commander.parse(process.argv);
};

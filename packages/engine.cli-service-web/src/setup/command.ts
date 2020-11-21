import commander from "commander";
import { performance } from "perf_hooks";

type props = {
  _commander: typeof commander;
  version: State["config"]["version"];
  start: Update<State["start"]["triggers"]["init"]>;
};

export const command: producer = ({
  _commander = commander,
  version = observe.config.version,
  start = update.start.triggers.init,
}: props) => {
  if (!version) {
    return;
  }

  _commander.version(version).usage("<command> [options]");

  _commander
    .command("start <app-name>")
    .description("Start the application")
    .action((name: string, cmd: commander.Command) => {
      const opts = cmd.opts();
      start.set({
        opts,
        timestamp: performance.now(),
      });
    });

  _commander.parse(process.argv);
};

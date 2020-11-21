import commander from "commander";

type props = {
  _commander: typeof commander;
  version: State["config"]["version"];
  startCreate: Update<State["create"]["triggers"]["start"]>;
};

export const command: producer = ({
  _commander = commander,
  version = observe.config.version,
  startCreate = update.create.triggers.start,
}: props) => {
  if (!version) {
    return;
  }

  _commander.version(version).usage("<command> [options]");

  _commander
    .command("create <app-name>")
    .description("Create a new engine project")
    .option(
      "-t, --template <template>",
      "If the template name starts with @, then then the template package used will match the option value\nOtherwise, the template package used will be @c11/template.<template>",
      "@c11/engine.templates-react"
      // "cra-template-engine"
    )
    .action((name: string, cmd: commander.Command) => {
      const opts = cmd.opts();
      startCreate.set({
        name,
        template: opts.template,
      });
    });

  _commander.parse(process.argv);
};

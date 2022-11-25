import { Command } from "commander";

type props = {
  _command: typeof Command;
  version: State["config"]["version"];
  startCreate: Update<State["create"]["triggers"]["start"]>;
};

export const command: producer = ({
  _command = Command,
  version = observe.config.version,
  startCreate = update.create.triggers.start,
}: props) => {
  if (!version) {
    return;
  }

  const program = new _command();

  program.version(version).usage("<command> [options]");

  //TODO: add support for listing existing templates
  program
    .command("create <app-name>")
    .description("Create a new engine project")
    .option(
      "-t, --template <template>",
      "If the template name starts with @, then then the template package used will match the option value\nOtherwise, the template package used will be @c11/template.<template>",
      "@c11/engine.template-react"
    )
    .action((name: string, options, cmd) => {
      const opts = cmd.opts();
      startCreate.set({
        name,
        template: opts.template,
      });
    });

  program.parse(process.argv);
};

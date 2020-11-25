import { spawn } from "child_process";

type props = {
  _spawn: typeof spawn;
  trigger: State["test"]["triggers"]["init"];
  commandPath: Get<State["config"]["commandPath"]>;
};

export const init: producer = ({
  _spawn = spawn,
  trigger = observe.test.triggers.init,
  commandPath = get.config.commandPath,
}: props) => {
  if (!trigger) {
    return;
  }
  spawn(
    `cd ${commandPath.value()} && jest --clear-cache && jest --config ./jest.config.js --runTestsByPath ./src/**/*`
  );
};

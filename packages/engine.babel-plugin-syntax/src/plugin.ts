import { PluginType } from "./types";
import { withOutput } from "./withOutput";
import { withoutOutput } from "./withoutOutput";

export const plugin: PluginType = (babel, state) => {
  if (state.output) {
    return withOutput(babel, state);
  } else {
    return withoutOutput(babel, state);
  }
};

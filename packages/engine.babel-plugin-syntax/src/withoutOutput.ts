import { PluginType } from "./types";
import { VariableDeclaratorVisitor } from "./visitors";

export const withoutOutput: PluginType = (babel, state) => {
  return {
    name: "@c11/engine.babel-plugin-syntax",
    visitor: {
      VariableDeclarator: VariableDeclaratorVisitor(babel, state),
    },
  };
};

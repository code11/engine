import * as Babel from "@babel/core";
import { VariableDeclaratorVisitor } from "./visitors";

export type PluginConfig = {
  viewLibrary: string;
};

type pluginType = (babel: typeof Babel, state: PluginConfig) => {};

export const plugin: pluginType = (babel, state) => {
  return {
    name: "babel-plugin-engine",
    visitor: {
      VariableDeclarator: VariableDeclaratorVisitor(babel, state),
    },
  };
};

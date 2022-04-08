import type * as Babel from "@babel/core";
import { PluginConfig } from "../plugin";
import { instrument } from "../utils";

export const VariableDeclaratorVisitor =
  (babel: typeof Babel, config: PluginConfig) =>
  (
    path: Babel.NodePath<Babel.types.VariableDeclarator>,
    state: Babel.PluginPass
  ) => {
    const t = babel.types;
    const id = path.node.id;
    const prefix = "__ENGINE_CONFIG__";

    if (!t.isIdentifier(id) || !id.name.includes(prefix)) {
      return;
    }

    instrument(babel, config, state, path);
  };

import type * as Babel from "@babel/core";
import { PluginConfig } from "../plugin";
import { hasHotModuleAccept } from "./hasHotModuleAccept";
import { addHotModuleAccept } from "./addHotModuleAccept";
import { addNamedImport } from "./addNamedImport";

export const instrument = (
  babel: typeof Babel,
  config: PluginConfig,
  state: Babel.PluginPass,
  path: Babel.NodePath<Babel.types.VariableDeclarator>
) => {
  const t = babel.types;
  const node = path.node;

  const program = path.findParent((p) =>
    p.isProgram()
  ) as Babel.NodePath<Babel.types.Program>;

  if (!hasHotModuleAccept(babel, program)) {
    addHotModuleAccept(babel, program);
  }

  const alias = addNamedImport(babel, program, "@c11/engine.runtime", "update");

  const declaration = path.find((x) => t.isDeclaration(x.node));

  if (declaration && t.isIdentifier(node.id)) {
    declaration.insertAfter(
      t.callExpression(t.identifier(alias), [t.identifier(node.id.name)])
    );
  }
};

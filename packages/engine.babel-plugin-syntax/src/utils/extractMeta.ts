import type * as Babel from "@babel/core";
import type { ProducerMeta } from "@c11/engine.types";

export const extractMeta = (
  babel: typeof Babel,
  state: Babel.PluginPass,
  path: Babel.NodePath<Babel.types.VariableDeclarator>
): ProducerMeta => {
  const t = babel.types;
  const node = path.node;
  const result: ProducerMeta = {};

  if (t.isIdentifier(node.id)) {
    result.name = node.id.name;
  }
  const loc = path.node.loc;
  if (loc) {
    result.location = {
      start: {
        line: loc.start.line,
        column: loc.start.column,
      },
      end: {
        line: loc.end.line,
        column: loc.end.column,
      },
    };
    result.absoluteFilePath = state.file.opts.filename || "";
    result.absoluteRootPath = state.file.opts.root || "";
    result.relativeFilePath = result.absoluteFilePath.replace(
      result.absoluteRootPath + "/",
      ""
    );
  }

  return result;
};

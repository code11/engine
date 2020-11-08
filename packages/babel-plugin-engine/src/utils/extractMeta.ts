import * as Babel from "@babel/core";
import { ProducerMeta } from "@c11/engine.types";

export const extractMeta = (
  babel: typeof Babel,
  path: Babel.NodePath<Babel.types.VariableDeclarator>
) => {
  const t = babel.types;
  const node = path.node;
  const result: ProducerMeta = {};

  if (t.isIdentifier(node.id)) {
    result.name = node.id.name
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
    //@ts-ignore
    result.fileName = loc.filename;
  }

  return result;
};

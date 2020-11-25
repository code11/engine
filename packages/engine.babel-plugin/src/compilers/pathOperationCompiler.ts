import type * as Babel from "@babel/core";
import type {
  GetOperation,
  UpdateOperation,
  ObserveOperation,
} from "@c11/engine.types";
import type { ObjectExpression } from "@babel/types";

import { pathCompiler } from "./pathCompiler";

export const pathOperationCompiler = (
  babel: typeof Babel,
  op: GetOperation | UpdateOperation | ObserveOperation
): ObjectExpression => {
  const t = babel.types;
  const type = t.objectProperty(t.identifier("type"), t.stringLiteral(op.type));
  let value = t.objectProperty(t.identifier("path"), t.stringLiteral("___"));
  value = t.objectProperty(t.identifier("path"), pathCompiler(babel, op.path));
  return t.objectExpression([type, value]);
};

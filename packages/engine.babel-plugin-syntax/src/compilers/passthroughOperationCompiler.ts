import type * as Babel from "@babel/core";
import type { ObjectExpression } from "@babel/types";
import { OperationTypes } from "@c11/engine.types";

export const passthroughOperationCompiler = (
  babel: typeof Babel
): ObjectExpression => {
  const t = babel.types;
  const type = t.objectProperty(
    t.identifier("type"),
    t.stringLiteral(OperationTypes.PASSTHROUGH)
  );
  return t.objectExpression([type]);
};

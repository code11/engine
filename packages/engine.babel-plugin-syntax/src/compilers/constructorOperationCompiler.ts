import type * as Babel from "@babel/core";
import type { ObjectExpression } from "@babel/types";
import { ConstructorOperation } from "@c11/engine.types";

export const constructorOperationCompiler = (
  babel: typeof Babel,
  op: ConstructorOperation
): ObjectExpression => {
  const t = babel.types;
  let value = t.objectProperty(
    t.identifier("value"),
    t.stringLiteral(op.value)
  );
  const type = t.objectProperty(t.identifier("type"), t.stringLiteral(op.type));
  return t.objectExpression([type, value]);
};

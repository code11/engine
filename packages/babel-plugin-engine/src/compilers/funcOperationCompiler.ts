import { FuncOperation } from "@c11/engine.types";
import * as Babel from "@babel/core";
import { ObjectExpression } from "@babel/types";

export const funcOperationCompiler = (
  babel: typeof Babel,
  op: FuncOperation
): ObjectExpression => {
  const t = babel.types;
  const type = t.objectProperty(t.identifier("type"), t.stringLiteral(op.type));
  const paramsList = op.value.params.map((x) => {
    const type = t.objectProperty(
      t.identifier("type"),
      t.stringLiteral(x.type)
    );
    const value = t.objectProperty(
      t.identifier("value"),
      t.stringLiteral("value")
    );
    return t.objectExpression([type, value]);
  });
  const fn = t.objectProperty(t.identifier("fn"), t.stringLiteral("fn"));
  const paramsArray = t.arrayExpression(paramsList);
  const params = t.objectProperty(t.identifier("params"), paramsArray);
  const internal = t.objectExpression([params, fn]);
  const value = t.objectProperty(t.identifier("value"), internal);
  return t.objectExpression([type, value]);
};

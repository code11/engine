import { ValueTypes, ValueOperation } from "@c11/engine.types";
import * as Babel from "@babel/core";
import { ObjectExpression } from "@babel/types";

export const valueOperationCompiler = (
  babel: typeof Babel,
  op: ValueOperation
): ObjectExpression => {
  const t = babel.types;
  let value = t.objectProperty(t.identifier("path"), t.stringLiteral("___"));
  const type = t.objectProperty(t.identifier("type"), t.stringLiteral(op.type));
  if (op.value.type === ValueTypes.CONST) {
    const val = op.value.value;

    let valType;
    if (val && val.__node__) {
      valType = val.__node__;
    } else if (typeof val === "string") {
      valType = t.stringLiteral(val);
    } else if (typeof val === "number") {
      valType = t.numericLiteral(val);
    } else if (typeof val === "boolean") {
      valType = t.booleanLiteral(val);
    } else {
      throw new Error("Value type not supported yet: " + typeof val);
    }

    value = t.objectProperty(
      t.identifier("value"),
      t.objectExpression([
        t.objectProperty(
          t.identifier("type"),
          t.stringLiteral(ValueTypes.CONST)
        ),
        t.objectProperty(t.identifier("value"), valType),
      ])
    );
  } else if (
    op.value.type === ValueTypes.EXTERNAL ||
    op.value.type === ValueTypes.INTERNAL
  ) {
    const path = t.arrayExpression(
      op.value.path.map((x) => t.stringLiteral(x))
    );
    value = t.objectProperty(
      t.identifier("value"),
      t.objectExpression([
        t.objectProperty(t.identifier("type"), t.stringLiteral(op.value.type)),
        t.objectProperty(t.identifier("path"), path),
      ])
    );
  }
  return t.objectExpression([type, value]);
};

import { ValueTypes, ValueOperation } from "@c11/engine-types";
import {
  objectProperty,
  identifier,
  objectExpression,
  stringLiteral,
  numericLiteral,
  booleanLiteral,
  arrayExpression,
  ObjectExpression,
} from "@babel/types";

export const valueOperationCompiler = (
  op: ValueOperation
): ObjectExpression => {
  let value = objectProperty(identifier("path"), stringLiteral("___"));
  const type = objectProperty(identifier("type"), stringLiteral(op.type));
  if (op.value.type === ValueTypes.CONST) {
    const val = op.value.value;

    let valType;
    if (val && val.__node__) {
      valType = val.__node__;
    } else if (typeof val === "string") {
      valType = stringLiteral(val);
    } else if (typeof val === "number") {
      valType = numericLiteral(val);
    } else if (typeof val === "boolean") {
      valType = booleanLiteral(val);
    } else {
      throw new Error("Value type not supported yet: " + typeof val);
    }

    value = objectProperty(
      identifier("value"),
      objectExpression([
        objectProperty(identifier("type"), stringLiteral(ValueTypes.CONST)),
        objectProperty(identifier("value"), valType),
      ])
    );
  } else if (
    op.value.type === ValueTypes.EXTERNAL ||
    op.value.type === ValueTypes.INTERNAL
  ) {
    const path = arrayExpression(op.value.path.map(x => stringLiteral(x)));
    value = objectProperty(
      identifier("value"),
      objectExpression([
        objectProperty(identifier("type"), stringLiteral(op.value.type)),
        objectProperty(identifier("path"), path),
      ])
    );
  }
  return objectExpression([type, value]);
};

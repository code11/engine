import {
  GetOperation,
  UpdateOperation,
  ObserveOperation,
} from "@c11/engine.types";
import {
  objectProperty,
  identifier,
  objectExpression,
  stringLiteral,
  ObjectExpression,
} from "@babel/types";

import { pathCompiler } from "./pathCompiler";

export const pathOperationCompiler = (
  op: GetOperation | UpdateOperation | ObserveOperation
): ObjectExpression => {
  const type = objectProperty(identifier("type"), stringLiteral(op.type));
  let value = objectProperty(identifier("path"), stringLiteral("___"));
  value = objectProperty(identifier("path"), pathCompiler(op.path));
  return objectExpression([type, value]);
};

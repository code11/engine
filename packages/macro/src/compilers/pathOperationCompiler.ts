import {
  GetOperation,
  SetOperation,
  RefOperation,
  MergeOperation,
  RemoveOperation,
} from "@c11/engine-types";
import {
  objectProperty,
  identifier,
  objectExpression,
  stringLiteral,
  ObjectExpression,
} from "@babel/types";

import { pathCompiler } from "./pathCompiler";

export const pathOperationCompiler = (
  op:
    | GetOperation
    | SetOperation
    | RefOperation
    | MergeOperation
    | RemoveOperation
): ObjectExpression => {
  const type = objectProperty(identifier("type"), stringLiteral(op.type));
  let value = objectProperty(identifier("path"), stringLiteral("___"));
  value = objectProperty(identifier("path"), pathCompiler(op.path));
  return objectExpression([type, value]);
};

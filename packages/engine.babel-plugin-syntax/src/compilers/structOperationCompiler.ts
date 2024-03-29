import type * as Babel from "@babel/core";
import type { ObjectExpression, ObjectProperty } from "@babel/types";
import { StructOperation, OperationTypes } from "@c11/engine.types";
import { pathOperationCompiler } from "./pathOperationCompiler";
import { funcOperationCompiler } from "./funcOperationCompiler";
import { valueOperationCompiler } from "./valueOperationCompiler";
import { constructorOperationCompiler } from "./constructorOperationCompiler";

export const structOperationCompiler = (
  babel: typeof Babel,
  opOrig: StructOperation
): ObjectExpression => {
  const t = babel.types;
  const type = t.objectProperty(
    t.identifier("type"),
    t.stringLiteral(opOrig.type)
  );
  //TODO: add an id to each operation so that events can
  // be traced back to it's originator operation and parent
  // see PATCH_APPLIED
  const keys: ObjectProperty[] = Object.keys(opOrig.value)
    .map((x) => {
      const op = opOrig.value[x];
      let result;
      if (op.type === OperationTypes.GET) {
        result = pathOperationCompiler(babel, op);
      } else if (op.type === OperationTypes.OBSERVE) {
        result = pathOperationCompiler(babel, op);
      } else if (op.type === OperationTypes.UPDATE) {
        result = pathOperationCompiler(babel, op);
      } else if (op.type === OperationTypes.FUNC) {
        result = funcOperationCompiler(babel, op);
      } else if (op.type === OperationTypes.STRUCT) {
        result = structOperationCompiler(babel, op);
      } else if (op.type === OperationTypes.VALUE) {
        result = valueOperationCompiler(babel, op);
      } else if (op.type === OperationTypes.CONSTRUCTOR) {
        result = constructorOperationCompiler(babel, op);
      } else {
        throw new Error(`Operation ${op} not supported`);
      }
      return t.objectProperty(t.identifier(x), result, false, true);
    })
    .filter((x) => !!x);

  const value = t.objectProperty(t.identifier("value"), t.objectPattern(keys));
  return t.objectExpression([type, value]);
};

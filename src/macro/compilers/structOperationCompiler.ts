import { StructOperation, OperationTypes } from '../../lib/producer/types';
import {
  objectPattern,
  objectProperty,
  identifier,
  objectExpression,
  stringLiteral,
  ObjectExpression,
  ObjectProperty
} from '@babel/types';
import { pathOperationCompiler } from './pathOperationCompiler';
import { funcOperationCompiler } from './funcOperationCompiler';
import { valueOperationCompiler } from './valueOperationCompiler';

export const structOperationCompiler = (
  opOrig: StructOperation
): ObjectExpression => {
  const type = objectProperty(identifier('type'), stringLiteral(opOrig.type));
  const keys: ObjectProperty[] = Object.keys(opOrig.value)
    .map(x => {
      const op = opOrig.value[x];
      let result;
      if (op.type === OperationTypes.GET) {
        result = pathOperationCompiler(op);
      } else if (op.type === OperationTypes.SET) {
        result = pathOperationCompiler(op);
      } else if (op.type === OperationTypes.MERGE) {
        result = pathOperationCompiler(op);
      } else if (op.type === OperationTypes.REF) {
        result = pathOperationCompiler(op);
      } else if (op.type === OperationTypes.FUNC) {
        result = funcOperationCompiler(op);
      } else if (op.type === OperationTypes.STRUCT) {
        result = structOperationCompiler(op);
      } else if (op.type === OperationTypes.VALUE) {
        result = valueOperationCompiler(op);
      } else {
        throw new Error(`Operation ${op} not supported`);
      }
      return objectProperty(identifier(x), result, false, true);
    })
    .filter(x => !!x);
  const value = objectProperty(identifier('value'), objectPattern(keys));
  return objectExpression([type, value]);
};

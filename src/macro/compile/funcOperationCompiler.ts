import { FuncOperation } from '../../lib/producer/types';
import {
  objectProperty,
  identifier,
  objectExpression,
  stringLiteral,
  arrayExpression,
  ObjectExpression
} from '@babel/types';

export const funcOperationCompiler = (op: FuncOperation): ObjectExpression => {
  const type = objectProperty(identifier('type'), stringLiteral(op.type));
  const paramsList = op.value.params.map(x => {
    const type = objectProperty(identifier('type'), stringLiteral(x.type));
    const value = objectProperty(identifier('value'), stringLiteral('value'));
    return objectExpression([type, value]);
  });
  const fn = objectProperty(identifier('fn'), stringLiteral('fn'));
  const paramsArray = arrayExpression(paramsList);
  const params = objectProperty(identifier('params'), paramsArray);
  const internal = objectExpression([params, fn]);
  const value = objectProperty(identifier('value'), internal);
  return objectExpression([type, value]);
};

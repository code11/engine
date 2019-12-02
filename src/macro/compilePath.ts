import { InvokablePath, ValueTypes } from '../lib/producer/types';
import {
  ArrayExpression,
  arrayExpression,
  objectExpression,
  objectProperty,
  identifier,
  stringLiteral,
  nullLiteral
} from '@babel/types';

export const compilePath = (path: InvokablePath): ArrayExpression => {
  const parts = path.map(x => {
    let type = objectProperty(identifier('type'), stringLiteral(x.type));
    let value = objectProperty(identifier('ignored'), nullLiteral());
    if (x.type === ValueTypes.CONST) {
      value = objectProperty(identifier('value'), stringLiteral(x.value));
    } else if (
      x.type === ValueTypes.INTERNAL ||
      x.type === ValueTypes.EXTERNAL
    ) {
      const path = x.path.map((y: string) => stringLiteral(y));
      value = objectProperty(identifier('path'), arrayExpression(path));
    } else if (x.type === ValueTypes.INVOKE) {
      value = objectProperty(identifier('path'), stringLiteral(x.name));
    }
    return objectExpression([type, value]);
  });
  const result = arrayExpression(parts);
  return result;
};

import { StructOperation, OperationTypes } from '../lib/producer/types';
import {
  ObjectPattern,
  objectPattern,
  objectProperty,
  identifier,
  ObjectProperty,
  objectExpression,
  stringLiteral
} from '@babel/types';
import { compilePath } from './compilePath';

export const compileStruct = (struct: StructOperation): ObjectPattern => {
  const keys: ObjectProperty[] = Object.keys(struct.value).map(x => {
    const op = struct.value[x];
    let result;
    if (op.type === OperationTypes.STRUCT) {
      console.log('should compile struct');
      result = compileStruct(op);
    } else {
      const type = objectProperty(identifier('type'), stringLiteral(op.type));
      let value = objectProperty(identifier('path'), stringLiteral('nothing'));
      if (
        op.type === OperationTypes.GET ||
        op.type === OperationTypes.SET ||
        op.type === OperationTypes.MERGE ||
        op.type === OperationTypes.REF
      ) {
        value = objectProperty(identifier('path'), compilePath(op.path));
      } else if (op.type === OperationTypes.FUNC) {
      } else if (op.type === OperationTypes.VALUE) {
        value = objectProperty(identifier('path'), stringLiteral('value'));
      } else {
      }
      result = objectExpression([type, value]);
    }
    return objectProperty(identifier(x), result, false, true);
  });
  const result = objectPattern(keys);
  return result;
};

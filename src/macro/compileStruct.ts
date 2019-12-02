import {
  StructOperation,
  OperationTypes,
  ValueTypes
} from '../lib/producer/types';
import {
  ObjectPattern,
  objectPattern,
  objectProperty,
  identifier,
  ObjectProperty,
  objectExpression,
  stringLiteral,
  numericLiteral,
  booleanLiteral
} from '@babel/types';
import { compilePath } from './compilePath';

export const compileStruct = (struct: StructOperation): ObjectPattern => {
  const keys: ObjectProperty[] = Object.keys(struct.value).map(x => {
    const op = struct.value[x];
    let result;
    if (op.type === OperationTypes.STRUCT) {
      console.log('should compile struct');
      const type = objectProperty(identifier('type'), stringLiteral(op.type));
      const value = objectProperty(identifier('value'), compileStruct(op));
      result = objectExpression([type, value]);
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
        if (op.value.type === ValueTypes.CONST) {
          const val = op.value.value;

          let valType;
          // TODO: This should be copied directly from the AST
          // instead of trying to reproduce the value here
          if (val && val.__node__) {
            valType = val.__node__;
          } else if (typeof val === 'string') {
            valType = stringLiteral(val);
          } else if (typeof val === 'number') {
            valType = numericLiteral(val);
          } else if (typeof val === 'boolean') {
            valType = booleanLiteral(val);
          } else {
            throw new Error('Value type not supported yet: ' + typeof val);
          }

          value = objectProperty(
            identifier('value'),
            objectExpression([
              objectProperty(identifier('type'), identifier(ValueTypes.CONST)),
              objectProperty(identifier('value'), valType)
            ])
          );
        }
      } else {
      }
      result = objectExpression([type, value]);
    }
    return objectProperty(identifier(x), result, false, true);
  });
  const result = objectPattern(keys);
  return result;
};

import { StructOperation } from '../lib/producer/types';
import {
  ObjectPattern,
  objectPattern,
  objectProperty,
  identifier
} from '@babel/types';

export const compileParams = (struct: StructOperation): ObjectPattern => {
  const value = struct.value;
  const keys = Object.keys(value).map(x => {
    return objectProperty(identifier(x), identifier(x), false, true);
  });
  const result = objectPattern(keys);
  return result;
};

import { StructOperation } from "@c11/engine-types";
import {
  ObjectPattern,
  objectPattern,
  objectProperty,
  identifier,
} from "@babel/types";

export const paramsCompiler = (struct: StructOperation): ObjectPattern => {
  const value = struct.value;
  const keys = Object.keys(value).map(x => {
    return objectProperty(identifier(x), identifier(x), false, true);
  });
  const result = objectPattern(keys);
  return result;
};

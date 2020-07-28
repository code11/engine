import { StructOperation } from "@c11/engine.types";
import {
  Identifier,
  identifier,
  ObjectPattern,
  objectPattern,
  ObjectProperty,
  objectProperty,
} from "@babel/types";

export const paramsCompiler = (struct: StructOperation): ObjectPattern[] => {
  const properties = Object.keys(struct.value).reduce((acc, x) => {
    acc.push(objectProperty(identifier(x), identifier(x)));
    return acc;
  }, [] as ObjectProperty[]);
  const result = [objectPattern(properties)];
  return result;
};

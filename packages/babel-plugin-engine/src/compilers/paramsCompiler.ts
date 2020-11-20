import type { StructOperation } from "@c11/engine.types";
import type * as Babel from "@babel/core";
import type { ObjectPattern, ObjectProperty } from "@babel/types";

export const paramsCompiler = (
  babel: typeof Babel,
  struct: StructOperation
): ObjectPattern[] => {
  const t = babel.types;
  const properties = Object.keys(struct.value).reduce((acc, x) => {
    acc.push(t.objectProperty(t.identifier(x), t.identifier(x)));
    return acc;
  }, [] as ObjectProperty[]);
  const result = [t.objectPattern(properties)];
  return result;
};

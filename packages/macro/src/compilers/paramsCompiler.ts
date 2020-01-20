import { StructOperation } from "@c11/engine-types";
import { Identifier, identifier } from "@babel/types";

export const paramsCompiler = (struct: StructOperation): Identifier[] => {
  const value = struct.value;
  const result = Object.keys(value)
    .sort((a, b) => value[a].meta.order - value[b].meta.order)
    .map(x => identifier(x));
  return result;
};

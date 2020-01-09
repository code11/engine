import { GraphStructure, ValueOperation } from "@c11/engine-types";
import { resolveValue } from "./resolveValue";

export const valueOperation = (
  structure: GraphStructure,
  op: ValueOperation
) => {
  const value = resolveValue(structure, op.value);
  return value;
};

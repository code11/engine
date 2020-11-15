import {
  GraphStructure,
  UpdateOperation,
  GetOperation,
  OperationParams
} from "@c11/engine.types";
import { PathSymbol } from "../path";
import { resolveValue } from "./resolveValue";
import { wildcard } from "../wildcard";

export const getInvokablePath = (
  structure: GraphStructure,
  op: GetOperation | UpdateOperation,
  params: OperationParams
) => {
  const path = op.path.reduce((acc, x: any) => {
    const value = resolveValue(structure, x, params);
    if (value && value.__symbol__ === PathSymbol) {
      const expanded = value[Symbol.toPrimitive]();
      if (expanded) {
        acc = acc.concat(expanded.split("."));
      }
    } else {
      if (value === wildcard) {
        acc.push("*");
      } else {
        acc.push(value);
      }
    }
    return acc;
  }, [] as any[]);
  if (path.includes(undefined) || path.includes(null)) {
    return;
  } else {
    return "/" + path.join("/");
  }
};

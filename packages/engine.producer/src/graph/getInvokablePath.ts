import {
  GraphStructure,
  UpdateOperation,
  GetOperation,
} from "@c11/engine.types";
import { PathSymbol } from "../path";
import { resolveValue } from "./resolveValue";
import { Wildcard } from "../wildcard";

export const getInvokablePath = (
  structure: GraphStructure,
  op: GetOperation | UpdateOperation,
  params: any
) => {
  const path = op.path.reduce((acc, x: any) => {
    const value = resolveValue(structure, x, params);
    if (value && value.__symbol__ === PathSymbol) {
      const expanded = value[Symbol.toPrimitive]();
      if (expanded) {
        acc = acc.concat(expanded.split("."));
      }
    } else {
      if (value === Wildcard) {
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

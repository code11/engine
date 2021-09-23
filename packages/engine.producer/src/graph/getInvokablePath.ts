import {
  GraphStructure,
  UpdateOperation,
  GetOperation,
  OperationParams,
} from "@c11/engine.types";
import isArray from "lodash/isArray";
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
      const expanded = value.__expand__();
      if (isArray(expanded)) {
        acc = acc.concat(expanded);
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

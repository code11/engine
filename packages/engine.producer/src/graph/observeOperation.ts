import { GraphStructure, ObserveOperation } from "@c11/engine.types";
import { isValidPath } from "./isValidPath";
import { resolveValue } from "./resolveValue";
import { PathSymbol } from "../path";

export const observeOperation = (
  structure: GraphStructure,
  op: ObserveOperation
) => {
  const path = op.path.reduce((acc, x: any) => {
    const value = resolveValue(structure, x);
    if (value && value.__symbol__ === PathSymbol) {
      const expanded = value[Symbol.toPrimitive];
      acc = acc.concat(expanded);
    } else {
      acc.push(value);
    }
    return acc;
  }, [] as any[]);

  if (isValidPath(path)) {
    const finalPath = "/" + path.join("/");
    return finalPath;
  } else {
    return;
  }
};

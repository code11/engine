import { GraphStructure, ObserveOperation } from "@c11/engine.types";
import { isValidPath } from "./isValidPath";
import { resolveValue } from "./resolveValue";

export const observeOperation = (
  structure: GraphStructure,
  op: ObserveOperation
) => {
  const path = op.path.map((x: any) => {
    return resolveValue(structure, x);
  });
  if (isValidPath(path)) {
    const finalPath = "/" + path.join("/");
    return finalPath;
  } else {
    return;
  }
};

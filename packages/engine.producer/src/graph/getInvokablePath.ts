import {
  GraphStructure,
  UpdateOperation,
  GetOperation,
} from "@c11/engine.types";
import { resolveValue } from "./resolveValue";

export const getInvokablePath = (
  structure: GraphStructure,
  op: GetOperation | UpdateOperation,
  params: any
) => {
  const path = op.path.map((x: any) => {
    return resolveValue(structure, x, params);
  });
  if (path.includes(undefined) || path.includes(null)) {
    return;
  } else {
    return "/" + path.join("/");
  }
};

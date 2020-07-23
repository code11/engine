import get from "lodash/get";
import { GraphStructure } from "@c11/engine.types";

export const getValue = (
  type: string,
  structure: GraphStructure,
  fullPath: string[]
) => {
  const path = [type].concat(fullPath);
  let found = false;
  let node;
  let parts = [];
  while (path.length > 0 && !found) {
    let tempPath = path.join(".");
    node = structure[tempPath];
    if (!node) {
      parts.unshift(path.pop());
    } else {
      found = true;
    }
  }
  if (node) {
    if (parts.length > 0) {
      return get(node.value, parts.join("."));
    } else {
      return node.value;
    }
  }
};

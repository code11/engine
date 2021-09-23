import { GraphStructure, PathSymbol } from "@c11/engine.types";
import { isPath, PathObject } from "../path";

export const getValue = (
  type: string,
  structure: GraphStructure,
  fullPath: string[]
) => {
  // console.log(type, fullPath);
  // console.log(structure);

  fullPath = fullPath.map((x) => {
    if (x.indexOf(PathSymbol.INTERNAL) === 0) {
      const reg = new RegExp(`^\\${PathSymbol.INTERNAL}`);
      const path = x.replace(reg, "");
      const value = getValue("internal", structure, path.split("."));
      return value;
    } else if (x.indexOf(PathSymbol.EXTERNAL) === 0) {
      const reg = new RegExp(`^\\${PathSymbol.EXTERNAL}`);
      const path = x.replace(reg, "");
      const value = getValue("external", structure, path.split("."));
      return value;
    } else {
      return x;
    }
  });
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
      let value = parts.reduce((acc, x) => {
        if (acc && x) {
          if (isPath(acc)) {
            if (acc instanceof PathObject) {
              acc = acc[x];
            } else {
              acc = acc(x);
            }
          } else {
            acc = acc[x];
          }
        } else {
          acc = void 0;
        }
        return acc;
      }, node.value);
      return value;
    } else {
      return node.value;
    }
  }
};

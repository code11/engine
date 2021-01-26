import { GraphData, GraphStructure } from "@c11/engine.types";
import cloneDeep from "clone-deep";
import isFunction from "lodash/isFunction";

export const cloneCbData = (
  data: GraphData,
  references: string[],
  structure: GraphStructure
) => {
  const refs = references.reduce((acc, x) => {
    if (structure[x]) {
      acc = acc.concat(structure[x].isDependedBy);
    }
    return acc;
  }, [] as string[]);

  data = Object.keys(data).reduce((acc: any, x) => {
    const value = data[x];
    if (refs.includes(`internal.${x}`) || isFunction(data[x])) {
      acc[x] = value;
    } else {
      acc[x] = cloneDeep(value);
    }
    return acc;
  }, {});

  return data;
};

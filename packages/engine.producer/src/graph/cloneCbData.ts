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
    if (value && value.__operation__) {
      const keys = Object.keys(value).filter(x => x !== "__operation__");
      for (const key of keys) {
        value[key].bind(value);
      }
      acc[x] = cloneDeep(value);
    } else if (refs.includes(`internal.${x}`) || isFunction(data[x])) {
      acc[x] = value;
    } else {
      acc[x] = cloneDeep(value);
    }
    return acc;
  }, {});

  return data;
};

import type * as Babel from "@babel/core";
import type { Identifier, ObjectPattern, ObjectProperty } from "@babel/types";
import { OperationTypes, StructOperation } from "@c11/engine.types";
import { processValue } from "./valueParser";

export const structParser = (
  babel: typeof Babel,
  obj: ObjectPattern
): StructOperation => {
  const t = babel.types;
  const result = obj.properties.reduce(
    (acc, x) => {
      if (t.isObjectProperty(x)) {
        const node = x as ObjectProperty;
        const propName = (node.key as Identifier).name;
        const propValue = processValue(babel, node);
        if (propValue) {
          acc.value[propName] = propValue;
        }
      } else {
        console.log("Not object property", x);
      }
      return acc;
    },
    {
      type: OperationTypes.STRUCT,
      value: {},
    } as StructOperation
  );
  return result;
};

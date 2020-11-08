import * as Babel from "@babel/core";
import {
  OperationTypes,
  StructOperation,
  ValueTypes,
  ValueOperation,
} from "@c11/engine.types";
import { processParamValue } from "./valueParser";

export const paramParser = (
  babel: typeof Babel,
  param: Babel.types.ObjectPattern
): StructOperation => {
  const t = babel.types;
  if (!param) {
    return {
      type: OperationTypes.STRUCT,
      value: {},
      meta: {},
    };
  }
  const result = param.properties.reduce(
    (acc, x, idx) => {
      if (t.isObjectProperty(x)) {
        if (t.isIdentifier(x.value)) {
          const node = x.value as Babel.types.Identifier;
          const propName = node.name;
          const propValue = {
            type: OperationTypes.VALUE,
            value: {
              type: ValueTypes.EXTERNAL,
              path: [propName],
            },
          } as ValueOperation;
          acc.value[propName] = propValue;
        } else if (t.isAssignmentPattern(x.value)) {
          const node = x.value as Babel.types.AssignmentPattern;
          const left = node.left as Babel.types.Identifier;
          const propName = left.name;
          const propValue = processParamValue(babel, node);
          if (propValue) {
            acc.value[propName] = propValue;
          } else {
            throw new Error(
              "Property " + propName + " could not be processed."
            );
          }
        } else {
          console.log("Not object property", x);
        }
      } else if (t.isRestElement(x)) {
        throw new Error("Rest operator is not supported.");
      }
      return acc;
    },
    {
      type: OperationTypes.STRUCT,
      value: {},
    } as StructOperation
  );

  result.meta = {};

  return result;
};

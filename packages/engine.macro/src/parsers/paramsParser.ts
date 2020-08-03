import {
  AssignmentPattern,
  isAssignmentPattern,
  Identifier,
  isIdentifier,
  ObjectPattern,
  ObjectProperty,
  isObjectProperty,
  isRestElement,
} from "@babel/types";
import {
  OperationTypes,
  StructOperation,
  ValueTypes,
  ValueOperation,
} from "@c11/engine.types";
import { processParamValue } from "./valueParser";

export const paramsParser = (params: ObjectPattern): StructOperation => {
  if (!params) {
    return {
      type: OperationTypes.STRUCT,
      value: {},
    };
  }
  const result = params.properties.reduce(
    (acc, x, idx) => {
      if (isObjectProperty(x)) {
        if (isIdentifier(x.value)) {
          const node = x.value as Identifier;
          const propName = node.name;
          const propValue = {
            type: OperationTypes.VALUE,
            value: {
              type: ValueTypes.EXTERNAL,
              path: [propName],
            },
          } as ValueOperation;
          acc.value[propName] = propValue;
        } else if (isAssignmentPattern(x.value)) {
          const node = x.value as AssignmentPattern;
          const left = node.left as Identifier;
          const propName = left.name;
          const propValue = processParamValue(node);
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
      } else if (isRestElement(x)) {
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

import {
  AssignmentPattern,
  isAssignmentPattern,
  Identifier,
  isIdentifier,
} from "@babel/types";
import {
  OperationTypes,
  StructOperation,
  ValueTypes,
  ValueOperation,
} from "@c11/engine.types";
import { processParamValue } from "./valueParser";

export const paramsParser = (params: AssignmentPattern[]): StructOperation => {
  const order: string[] = [];
  const result = params.reduce(
    (acc, x, idx) => {
      if (isIdentifier(x)) {
        const node = x as Identifier;
        const propName = node.name;
        const propValue = {
          type: OperationTypes.VALUE,
          value: {
            type: ValueTypes.EXTERNAL,
            path: [propName],
          },
        } as ValueOperation;
        order.push(propName);
        acc.value[propName] = propValue;
      } else if (isAssignmentPattern(x)) {
        const node = x as AssignmentPattern;
        const left = node.left as Identifier;
        const propName = left.name;
        const propValue = processParamValue(node);
        if (propValue) {
          order.push(propName);
          acc.value[propName] = propValue;
        } else {
          throw new Error("Property " + propName + " could not be processed.");
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

  result.meta = {
    order,
  };

  return result;
};

import { GraphStructure, ValueTypes, InvokableValue } from "@c11/engine-types";
import { getValue } from "./getValue";
import get from "lodash/get";

export const resolveValue = (
  structure: GraphStructure,
  value: InvokableValue,
  invokable?: any
) => {
  console.log("Resolving value for", value, invokable);
  if (value.type === ValueTypes.CONST) {
    return value.value;
  } else if (value.type === ValueTypes.EXTERNAL) {
    return getValue("external", structure, value.path);
  } else if (value.type === ValueTypes.INTERNAL) {
    return getValue("internal", structure, value.path);
  } else if (value.type === ValueTypes.INVOKE) {
    if (invokable) {
      return get(invokable, value.path);
    }
  }
};

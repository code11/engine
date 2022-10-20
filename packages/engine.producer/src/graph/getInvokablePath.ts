import {
  GraphStructure,
  UpdateOperation,
  GetOperation,
  OperationParams,
  ValueTypes,
} from "@c11/engine.types";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import { PathSymbol } from "../path";
import { resolveValue } from "./resolveValue";
import { wildcard } from "../wildcard";

export const getInvokablePath = (
  structure: GraphStructure,
  op: GetOperation | UpdateOperation,
  params: OperationParams
) => {
  const noRefinee = op.path.filter((x) => !x || x.type !== ValueTypes.REFINEE);
  const path = noRefinee.reduce((acc, x: any) => {
    const value = resolveValue(structure, x, params);
    if (value && value.__symbol__ === PathSymbol) {
      const expanded = value.__expand__();
      if (isArray(expanded)) {
        acc = acc.concat(expanded);
      }
    } else {
      if (value === wildcard) {
        acc.push("*");
      } else {
        //TODO: if the value is not a string then throw an error
        acc.push(value);
      }
    }
    return acc;
  }, [] as any[]);

  if (!path.every((x) => isString(x) || isNumber(x))) {
    return;
  } else {
    return "/" + path.join("/");
  }
};

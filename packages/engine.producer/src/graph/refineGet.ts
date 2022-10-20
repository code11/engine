import {
  AccessMethods,
  GraphStructure,
  InvokableValue,
  ValueTypes,
} from "@c11/engine.types";
import { GetOperationSymbol } from "./getOperation";
import { resolveValue } from "./resolveValue";

//TODO: add proper types
export const refineGet = (structure: GraphStructure, op: any): any => {
  if (op?.__operation__?.symbol !== GetOperationSymbol) {
    return op;
  }

  const refine: InvokableValue =
    op.__operation__.path[op.__operation__.path.length - 1];
  if (refine?.type !== ValueTypes.REFINEE) {
    return op;
  }

  const type = refine.value.type;
  if (type === AccessMethods.value) {
    const args = refine.value.args.map((x) => resolveValue(structure, x));
    return op.value.apply(null, args);
  } else if (type === AccessMethods.includes) {
    const args = refine.value.args.map((x) => resolveValue(structure, x));
    return op.includes.apply(null, args);
  } else if (type === AccessMethods.length) {
    const args = refine.value.args.map((x) => resolveValue(structure, x));
    return op.length.apply(null, args);
  } else {
    throw new Error(`access method not recognized ${refine.value.type}`);
  }
};

import {
  AccessMethods,
  GraphStructure,
  InvokableValue,
  RefiningValue,
  ValueTypes,
} from "@c11/engine.types";
import { GetOperationSymbol } from "./getOperation";
import { getRefinee } from "./getRefinee";
import { resolveValue } from "./resolveValue";

//TODO: add proper types
export const refineGet = (structure: GraphStructure, op: any): any => {
  if (op?.__operation__?.symbol !== GetOperationSymbol) {
    return op;
  }

  const refine = getRefinee(op.__operation__.path);
  if (!refine) {
    return op;
  }

  const type = refine.type;
  if (type === AccessMethods.value) {
    const args = refine.args.map((x) => resolveValue(structure, x));
    return op.value.apply(op, args);
  } else if (type === AccessMethods.includes) {
    const args = refine.args.map((x) => resolveValue(structure, x));
    return op.includes.apply(op, args);
  } else if (type === AccessMethods.length) {
    const args = refine.args.map((x) => resolveValue(structure, x));
    return op.length.apply(op, args);
  } else {
    throw new Error(`access method not recognized ${refine.type}`);
  }
};

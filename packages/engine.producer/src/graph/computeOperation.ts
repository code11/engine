import {
  DatastoreInstance,
  OperationTypes,
  GraphStructure,
  GraphInternalNode,
} from "@c11/engine.types";
import { observeOperation } from "./observeOperation";
import { isValidPath } from "./isValidPath";
import { valueOperation } from "./valueOperation";
import { updateOperation } from "./updateOperation";
import { getOperation } from "./getOperation";
import { funcOperation } from "./funcOperation";
import { constructorOperation } from "./constructorOperation";

export enum ComputeType {
  PATH = "PATH",
  VALUE = "VALUE",
}
export interface ComputeResult {
  type: ComputeType;
  value: any;
}
export const computeOperation = (
  db: DatastoreInstance,
  structure: GraphStructure,
  node: GraphInternalNode
): ComputeResult => {
  const result: ComputeResult = {
    type:
      node.op.type === OperationTypes.OBSERVE
        ? ComputeType.PATH
        : ComputeType.VALUE,
    value: undefined,
  };
  if (node.op.type === OperationTypes.OBSERVE) {
    const path = observeOperation(structure, node.op);
    if (path && isValidPath(path)) {
      result.value = path;
    }
  } else if (node.op.type === OperationTypes.VALUE) {
    result.value = valueOperation(structure, node.op);
  } else if (node.op.type === OperationTypes.UPDATE) {
    result.value = updateOperation(db, structure, node.op);
  } else if (node.op.type === OperationTypes.GET) {
    result.value = getOperation(db, structure, node.op);
  } else if (node.op.type === OperationTypes.FUNC) {
    result.value = funcOperation(db, structure, node.op);
  } else if (node.op.type === OperationTypes.CONSTRUCTOR) {
    result.value = constructorOperation(db, structure, node);
  }
  return result;
};

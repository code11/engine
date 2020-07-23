import {
  DatastoreInstance,
  OperationTypes,
  GraphStructure,
  GraphInternalNode,
} from "@c11/engine.types";
import { getOperation } from "./getOperation";
import { isValidPath } from "./isValidPath";
import { valueOperation } from "./valueOperation";
import { updateOperation } from "./updateOperation";
import { refOperation } from "./refOperation";
import { funcOperation } from "./funcOperation";
import { removeOperation } from "./removeOperation";

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
      node.op.type === OperationTypes.GET
        ? ComputeType.PATH
        : ComputeType.VALUE,
    value: undefined,
  };
  if (node.op.type === OperationTypes.GET) {
    const path = getOperation(structure, node.op);
    if (path && isValidPath(path)) {
      result.value = path;
    }
  } else if (node.op.type === OperationTypes.VALUE) {
    result.value = valueOperation(structure, node.op);
  } else if (
    node.op.type === OperationTypes.MERGE ||
    node.op.type === OperationTypes.SET
  ) {
    result.value = updateOperation(db, structure, node.op);
  } else if (node.op.type === OperationTypes.REMOVE) {
    result.value = removeOperation(db, structure, node.op);
  } else if (node.op.type === OperationTypes.REF) {
    result.value = refOperation(db, structure, node.op);
  } else if (node.op.type === OperationTypes.FUNC) {
    result.value = funcOperation(db, structure, node.op);
  }

  return result;
};

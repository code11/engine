import {
  DatastoreInstance,
  GraphStructure,
  OperationTypes,
  MergeOperation,
  SetOperation,
  RemoveOperation,
} from "@c11/engine.types";
import { getInvokablePath } from "./getInvokablePath";

export const removeOperation = (
  db: DatastoreInstance,
  structure: GraphStructure,
  op: RemoveOperation
) => {
  const fn = (params: any) => {
    const path = getInvokablePath(structure, op, params);
    if (path) {
      const patch = {
        op: "remove",
        path,
      };
      db.patch([patch]);
    }
  };
  return fn;
};

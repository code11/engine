import {
  DatastoreInstance,
  GraphStructure,
  OperationTypes,
  MergeOperation,
  SetOperation,
} from "@c11/engine.types";
import { getInvokablePath } from "./getInvokablePath";

export const updateOperation = (
  db: DatastoreInstance,
  structure: GraphStructure,
  op: MergeOperation | SetOperation
) => {
  const opType = op.type === OperationTypes.MERGE ? "merge" : "add";
  const fn = (value: any, params: any) => {
    const path = getInvokablePath(structure, op, params);
    if (path) {
      const patch = {
        op: opType,
        path,
        value: value,
      };
      if (op.type === OperationTypes.MERGE) {
        const val = db.get(path);
        if (!val) {
          db.patch([
            {
              op: "add",
              path,
              value: {},
            },
          ]);
        }
      }
      db.patch([patch]);
    }
  };
  return fn;
};

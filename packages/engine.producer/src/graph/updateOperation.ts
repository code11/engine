import {
  DatastoreInstance,
  GraphStructure,
  UpdateOperation,
} from "@c11/engine.types";
import { getInvokablePath } from "./getInvokablePath";

export const updateOperation = (
  db: DatastoreInstance,
  structure: GraphStructure,
  op: UpdateOperation
) => {
  const set = (value: any, params: any) => {
    const path = getInvokablePath(structure, op, params);
    if (path) {
      const patch = {
        op: "add",
        path,
        value: value,
      };
      db.patch([patch]);
    }
  };
  const merge = (value: any, params: any) => {
    const path = getInvokablePath(structure, op, params);
    if (path) {
      const patch = {
        op: "merge",
        path,
        value: value,
      };
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
      db.patch([patch]);
    }
  };
  const remove = (params: any) => {
    const path = getInvokablePath(structure, op, params);
    if (path) {
      const patch = {
        op: "remove",
        path,
      };
      db.patch([patch]);
    }
  };
  return {
    set,
    merge,
    remove,
  };
};

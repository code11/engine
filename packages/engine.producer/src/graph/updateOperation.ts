import {
  DatastoreInstance,
  GraphStructure,
  UpdateOperation,
  OperationParams
} from "@c11/engine.types";
import isArray from "lodash/isArray";
import { getInvokablePath } from "./getInvokablePath";

export const updateOperation = (
  db: DatastoreInstance,
  structure: GraphStructure,
  op: UpdateOperation
) => {
  const set = (value: any, params: OperationParams) => {
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
  const merge = (value: any, params: OperationParams) => {
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
  const remove = (params: OperationParams) => {
    const path = getInvokablePath(structure, op, params);
    if (path) {
      const patch = {
        op: "remove",
        path,
      };
      db.patch([patch]);
    }
  };
  const push = (value: any, params: OperationParams) => {
    const path = getInvokablePath(structure, op, params);
    if (path) {
      const val = db.get(path)
      if (!isArray(val)) {
        // console.error('path is not an array')
        return
      }
      val.push(value)
      const patch = {
        op: "add",
        path: path,
        value: val
      };
      db.patch([patch]);
    }
  };
  const pop = (params: OperationParams) => {
    const path = getInvokablePath(structure, op, params);
    if (path) {
      const val = db.get(path)
      if (!isArray(val)) {
        // console.error('path is not an array')
        return
      }
      val.pop()
      const patch = {
        op: "add",
        path: path,
        value: val
      };
      db.patch([patch]);
    }
  };

  return {
    set,
    merge,
    remove,
    push,
    pop
  }
};

import { DB } from "jsonmvc-datastore";
import { GraphStructure, RefOperation } from "@c11/engine-types";
import { getInvokablePath } from "./getInvokablePath";

// TODO: add a isValid method to be able to check
// if the ref path is properly generated

// TODO: Return a false or error if the path was not generated

export const refOperation = (
  db: DB,
  structure: GraphStructure,
  op: RefOperation
) => {
  const refGet = (params: any) => {
    const path = getInvokablePath(structure, op, params);
    if (path) {
      return db.get(path);
    }
  };
  const ref = {
    get: refGet,
  };

  return ref;
};

import {
  DatastoreInstance,
  GraphStructure,
  GetOperation,
} from "@c11/engine.types";
import { getInvokablePath } from "./getInvokablePath";

// TODO: add a isValid method to be able to check
// if the ref path is properly generated

// TODO: Return a false or error if the path was not generated

export const getOperation = (
  db: DatastoreInstance,
  structure: GraphStructure,
  op: GetOperation
) => {
  const get = (params: any) => {
    const path = getInvokablePath(structure, op, params);
    if (path) {
      return db.get(path);
    }
  };
  return get;
};

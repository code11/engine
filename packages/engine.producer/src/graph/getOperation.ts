import {
  DatastoreInstance,
  GraphStructure,
  GetOperation,
  OperationParams,
} from "@c11/engine.types";
import { randomId } from "@c11/engine.utils";
import isString from "lodash/isString";
import isArray from "lodash/isArray";
import { getInvokablePath } from "./getInvokablePath";
import isFunction from "lodash/isFunction";

// TODO: add a isValid method to be able to check
// if the ref path is properly generated

// TODO: Return a false or error if the path was not generated

export const GetOperationSymbol = Symbol("get");

export const getOperation = (
  db: DatastoreInstance,
  structure: GraphStructure,
  op: GetOperation
) => {
  const value = (params: OperationParams): unknown => {
    const path = getInvokablePath(structure, op, params);
    if (path) {
      return db.get(path);
    }
    return;
  };
  const includes = (value: any, params: OperationParams): void | boolean => {
    const path = getInvokablePath(structure, op, params);
    if (path) {
      const val = db.get(path);
      if (isArray(val) || isString(val)) {
        return val.includes(value);
      }
    }
  };
  const length = (params: OperationParams): void | number => {
    const path = getInvokablePath(structure, op, params);
    if (path) {
      const val = db.get(path);
      if (!(isString(val) || isArray(val) || isFunction(val))) {
        return;
      }
      return val.length;
    }
  };

  const operation = {
    value,
    includes,
    length,
    __operation__: {
      id: randomId(),
      symbol: GetOperationSymbol,
      path: op.path,
    },
  };

  return operation;
};

import {
  DatastoreInstance,
  GraphStructure,
  GetOperation,
  OperationParams,
  ProducerContext,
  AccessMethods,
} from "@c11/engine.types";
import { randomId } from "@c11/engine.utils";
import isString from "lodash/isString";
import isArray from "lodash/isArray";
import isFunction from "lodash/isFunction";
import { getInvokablePath } from "./getInvokablePath";

// TODO: add a isValid method to be able to check
// if the ref path is properly generated

// TODO: Return a false or error if the path was not generated

export const GetOperationSymbol = Symbol("get");

// TODO: add type for getOperation -> GetOperationRuntime

export const getOperation = (
  db: DatastoreInstance,
  structure: GraphStructure,
  op: GetOperation,
  emit?: ProducerContext["emit"]
) => {
  //TODO: add emit for retrieving data
  function value(params: OperationParams): unknown {
    const path = getInvokablePath(
      structure,
      //@ts-ignore
      { path: this.__operation__.path },
      params
    );
    if (path) {
      return db.get(path);
    }
    return;
  }
  function includes(value: any, params: OperationParams): void | boolean {
    const path = getInvokablePath(
      structure,
      //@ts-ignore
      { path: this.__operation__.path },
      params
    );
    if (path) {
      const val = db.get(path);
      if (isArray(val) || isString(val)) {
        return val.includes(value);
      }
    }
  }
  function length(params: OperationParams): void | number {
    const path = getInvokablePath(
      structure,
      //@ts-ignore
      { path: this.__operation__.path },
      params
    );
    if (path) {
      const val = db.get(path);
      if (!(isString(val) || isArray(val) || isFunction(val))) {
        return;
      }
      return val.length;
    }
  }

  //TODO: add an exists method as well
  // if (getFoo.exists()) { ... }
  // this should check if the path exists and if the
  // value is not undefined

  //TODO: add an `is` method in order to test the value
  // getFoo.is('string')
  // getFoo.isString()
  // getFoo.isObject()
  // getFoo.isArray()
  // getFoo.is({ type: object, properties: { foo: { type: string }}}}) // schema

  const operation = {
    [AccessMethods.value]: value,
    [AccessMethods.includes]: includes,
    [AccessMethods.length]: length,
    __operation__: {
      id: randomId(),
      symbol: GetOperationSymbol,
      path: op.path,
    },
  };

  return operation;
};

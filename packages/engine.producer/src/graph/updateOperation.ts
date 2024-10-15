import {
  DatastoreInstance,
  GraphStructure,
  UpdateOperation,
  OperationParams,
  ProducerContext,
  EventNames,
  OperationTypes,
  UpdateValue,
  UpdateMethods,
} from "@c11/engine.types";
import { randomId } from "@c11/engine.utils";
import isArray from "lodash/isArray";
import { getInvokablePath } from "./getInvokablePath";

export const UpdateOperationSymbol = Symbol("update");

export const updateOperation = (
  db: DatastoreInstance,
  structure: GraphStructure,
  op: UpdateOperation,
  emit?: ProducerContext["emit"]
) => {
  const operationId = randomId();
  //TODO: figure out how to infer the cb using typescript from
  // name
  function wrapUpdate(name: UpdateMethods, cb: any) {
    function updateFn(...args: any[]) {
      //@ts-ignore
      const patch = cb.apply(this, args);
      if (emit && patch) {
        //TODO: add stack trace information so that code location
        // can be highlighted in the dashboard
        emit(EventNames.PATCH_APPLIED, patch, {
          operationId,
          operationType: OperationTypes.UPDATE,
          operationFnName: name,
        });
      }
    }

    return updateFn;
  }

  const set = wrapUpdate(
    UpdateMethods.set,
    function (value: any, params: OperationParams) {
      const path = getInvokablePath(
        structure,
        //@ts-ignore
        { path: this.__operation__.path },
        params
      );
      if (path) {
        const patch = {
          op: "add",
          path,
          value: value,
        };
        db.patch([patch]);
        return patch;
      }
      return;
    }
  );

  const merge = wrapUpdate(
    UpdateMethods.merge,
    function (value: any, params: OperationParams) {
      const path = getInvokablePath(
        structure,
        //@ts-ignore
        { path: this.__operation__.path },
        params
      );
      if (path) {
        let patch = [
          {
            op: "merge",
            path,
            value: value,
          },
        ];
        const val = db.get(path);
        if (!val) {
          patch.unshift({
            op: "add",
            path,
            value: {},
          });
        }
        db.patch(patch);
        return patch;
      }
      return;
    }
  );

  const remove = wrapUpdate(
    UpdateMethods.remove,
    function (params: OperationParams) {
      const path = getInvokablePath(
        structure,
        //@ts-ignore
        { path: this.__operation__.path },
        params
      );
      if (path) {
        const patch = {
          op: "remove",
          path,
        };
        db.patch([patch]);
        return patch;
      }
      return;
    }
  );

  const push = wrapUpdate(
    UpdateMethods.push,
    function (value: any, params: OperationParams) {
      const path = getInvokablePath(
        structure,
        //@ts-ignore
        { path: this.__operation__.path },
        params
      );
      if (path) {
        let val = db.get(path);
        if (val === undefined) {
          val = [];
        } else if (!isArray(val)) {
          // console.error("path is not an array");
          return;
        }
        val.push(value);
        const patch = {
          op: "add",
          path: path,
          value: val,
        };
        db.patch([patch]);
        return patch;
      }
      return;
    }
  );

  const pop = wrapUpdate(UpdateMethods.pop, function (params: OperationParams) {
    const path = getInvokablePath(
      structure,
      //@ts-ignore
      { path: this.__operation__.path },
      params
    );
    if (path) {
      const val = db.get(path);
      if (!isArray(val)) {
        // console.error('path is not an array')
        return;
      }
      val.pop();
      const patch = {
        op: "add",
        path: path,
        value: val,
      };
      db.patch([patch]);
      return patch;
    }
    return;
  });

  const operation = {
    [UpdateMethods.set]: set,
    [UpdateMethods.merge]: merge,
    [UpdateMethods.remove]: remove,
    [UpdateMethods.push]: push,
    [UpdateMethods.pop]: pop,
    __operation__: {
      id: operationId,
      symbol: UpdateOperationSymbol,
      path: op.path,
    },
  };

  // TODO: bind the functions to the operation

  return operation;
};

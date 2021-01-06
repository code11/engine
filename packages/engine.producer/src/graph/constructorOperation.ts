import {
  DatastoreInstance,
  GraphStructure,
  ConstructorOperation,
  PathType,
  OperationTypes,
  ValueTypes,
  GraphInternalNode,
} from "@c11/engine.types";
import { nanoid } from "nanoid";
import { getOperation } from "./getOperation";
import { observeOperation } from "./observeOperation";
import { updateOperation } from "./updateOperation";

export const constructorOperation = (
  db: DatastoreInstance,
  structure: GraphStructure,
  node: GraphInternalNode
) => {
  let result;
  const op = node.op as ConstructorOperation;
  if (op.value === PathType.GET) {
    result = (path: any) => {
      return getOperation(db, structure, {
        type: OperationTypes.GET,
        path: [{ type: ValueTypes.CONST, value: path }],
      });
    };
  } else if (op.value === PathType.OBSERVE) {
    result = (path: any, cb: any) => {
      const observePath = observeOperation(structure, {
        type: OperationTypes.OBSERVE,
        path: [{ type: ValueTypes.CONST, value: path }],
      });

      if (!observePath) {
        throw new Error("Invalid path. `observe` was not set.");
      }

      const removeListener = db.on(observePath, cb);
      const listenerId = nanoid();
      node.listenersFromConstructors[listenerId] = removeListener;

      return () => {
        delete node.listenersFromConstructors[listenerId];
        removeListener();
      };
    };
  } else if (op.value === PathType.UPDATE) {
    result = (path: any) => {
      return updateOperation(db, structure, {
        type: OperationTypes.UPDATE,
        path: [{ type: ValueTypes.CONST, value: path }],
      });
    };
  }
  return result;
};

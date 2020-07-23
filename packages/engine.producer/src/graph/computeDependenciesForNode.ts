import set from "lodash/set";
import isEqual from "lodash/isEqual";
import {
  DatastoreInstance,
  OperationTypes,
  ValueTypes,
  GraphStructure,
  GraphNodeType,
  GraphNode,
} from "@c11/engine.types";
import { computeOperation, ComputeType } from "./computeOperation";

export const computeDependenciesForNode = (
  update: Function,
  db: DatastoreInstance,
  data: any,
  structure: GraphStructure,
  node: GraphNode
) => {
  let listeners: string[] = [];
  let funcListeners: { id: string; param: number }[] = [];
  node.isDependedBy.forEach((x) => {
    const dep = structure[x];
    if (dep.type === GraphNodeType.INTERNAL) {
      const result = computeOperation(db, structure, dep);

      if (result.type === ComputeType.PATH) {
        listeners.push(x);
      }

      if (result.type === ComputeType.PATH && result.value) {
        dep.path = result.value;
        dep.value = db.get(result.value);
        // dep.removeListener =
      } else if (result.type === ComputeType.VALUE) {
        dep.value = result.value;
      }
      set(data, dep.nesting, dep.value);
      const newListeners = computeDependenciesForNode(
        update,
        db,
        data,
        structure,
        dep
      );
      listeners = listeners.concat(newListeners.listeners);
      funcListeners = funcListeners.concat(newListeners.funcListeners);

      if (dep.op.type === OperationTypes.FUNC) {
        dep.op.value.params.forEach((op, i) => {
          if (op.type === OperationTypes.GET) {
            op.path.forEach((z) => {
              if (z.type === ValueTypes.INTERNAL) {
                if (isEqual(z.path, node.nestingPath)) {
                  funcListeners.push({
                    id: dep.id,
                    param: i,
                  });
                }
              }
            });
          }
        });
      }
    }
  });

  return { listeners, funcListeners };
};

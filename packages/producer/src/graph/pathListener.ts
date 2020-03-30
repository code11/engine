import set from "lodash/set";
import {
  GraphData,
  GraphStructure,
  GraphNode,
  GraphNodeType,
  OperationTypes,
  GraphInternalNode,
} from "@c11/engine-types";
import { DB } from "jsonmvc-datastore";
import { computeDependenciesForNode } from "./computeDependenciesForNode";
import { getOperation } from "./getOperation";
import { funcOperation } from "./funcOperation";
import { computeOperation, ComputeType } from "./computeOperation";

// TODO: This needs to be rethought around the Get operation
// that is the only one that responds to updates to the state
// and creates a dependency chain between args + once one arg
// is updated the rest need to be updated to the latest version
// from the state which could trigger the evaluation for other
// statements as well
export const pathListener = (
  update: Function,
  db: DB,
  data: GraphData,
  structure: GraphStructure,
  node: GraphNode
) => {
  // Don't trigger is for updates that occur during anoter Get
  // operation that would otherwise call the update multiple
  // times for the same value
  return (newValue: any, shouldUpdate?: boolean) => {
    if (newValue === node.value) {
      return;
    }
    node.value = newValue;
    set(data, node.nesting, node.value);

    const updateListeners = computeDependenciesForNode(
      update,
      db,
      data,
      structure,
      node
    );

    Object.values(structure).forEach(x => {
      let node = x as GraphInternalNode;
      if (node.op && node.op.type === OperationTypes.GET) {
        const result = computeOperation(db, structure, node);
        if (result.type === ComputeType.PATH && result.value) {
          node.path = result.value;
          const newValue = db.get(result.value);
          if (node.listener) {
            node.listener(newValue, true);
          }
        }
      }
    });

    updateListeners.listeners.forEach(x => {
      const node = structure[x];
      if (node.type === GraphNodeType.INTERNAL) {
        if (node.removeListener) {
          node.removeListener();
        }
        if (node.path) {
          node.removeListener = db.on(
            node.path,
            pathListener(update, db, data, structure, node)
          );
          node.value = db.get(node.path);
          set(data, node.nesting, node.value);
        }
      }
    });
    updateListeners.funcListeners.forEach(x => {
      const node = structure[x.id];
      if (
        node.type === GraphNodeType.INTERNAL &&
        node.op.type === OperationTypes.FUNC
      ) {
        if (node.removeFuncListeners[x.param]) {
          node.removeFuncListeners[x.param]();
        }
        if (node.op.value.params[x.param]) {
          const op = node.op.value.params[x.param];

          if (op.type === OperationTypes.GET) {
            const path = getOperation(structure, op);
            if (path) {
              node.removeFuncListeners[x.param] = db.on(path, val => {
                if (node.op.type === OperationTypes.FUNC) {
                  const result = funcOperation(db, structure, node.op);
                  node.value = result;
                  set(data, node.nesting, node.value);
                  update();
                }
              });
            }
          }
        }
      }
    });

    if (!shouldUpdate) {
      update();
    }
  };
};

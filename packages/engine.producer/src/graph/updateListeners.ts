import set from "lodash/set";
import {
  DatastoreInstance,
  GraphNodeType,
  OperationTypes,
  GraphInternalNode,
  GraphData,
  GraphStructure,
  GraphNode,
} from "@c11/engine.types";
import { computeDependenciesForNode } from "./computeDependenciesForNode";
import { observeOperation } from "./observeOperation";
import { funcOperation } from "./funcOperation";
import { computeOperation, ComputeType } from "./computeOperation";
import { pathListener } from "./pathListener";
import { hasWildcard } from "./hasWildcard";
import { Graph } from "./graph";
import { getRefinee } from "./getRefinee";

export const updateListeners = (
  _this: Graph,
  update: Function,
  db: DatastoreInstance,
  data: GraphData,
  structure: GraphStructure,
  updatedNode: GraphNode
) => {
  const deps = computeDependenciesForNode(
    update,
    db,
    data,
    structure,
    updatedNode,
    _this.emit
  );

  // TODO:
  // - this should be called only if needed
  // - moved in the update section from graph in order to call
  //   right before the producer function
  // - if the next listeners/dependencies need values then
  //   the computation needs to be done there
  Object.values(structure).forEach((x) => {
    if (x === updatedNode) {
      return;
    }
    let node = x as GraphInternalNode;
    if (node.op && node.op.type === OperationTypes.OBSERVE) {
      const result = computeOperation(db, structure, node, _this.emit);
      if (result.type === ComputeType.PATH && result.value) {
        node.path = result.value;
        if (hasWildcard(result.value)) {
          return;
        }
        const newValue = db.get(result.value);
        if (node.listener) {
          node.listener(newValue, [], true);
        }
      }
    }
  });

  deps.listeners.forEach((x) => {
    const node = structure[x];
    if (node.type === GraphNodeType.INTERNAL) {
      if (node.removeListener) {
        node.removeListener();
      }
      if (node.path) {
        node.removeListener = db.on(
          node.path,
          pathListener(_this, update, db, _this.data, structure, node),
          //@ts-ignore
          getRefinee(node.op.path)
        );
        if (hasWildcard(node.path)) {
          return;
        }
        node.value = db.get(node.path);
        set(_this.data, node.nesting, node.value);
      }
    }
  });

  deps.funcListeners.forEach((x) => {
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

        if (op.type === OperationTypes.OBSERVE) {
          const path = observeOperation(structure, op);
          if (path) {
            node.removeFuncListeners[x.param] = db.on(path, (val) => {
              if (node.op.type === OperationTypes.FUNC) {
                const result = funcOperation(db, structure, node.op);
                node.value = result;
                set(_this.data, node.nesting, node.value);
                update();
              }
            });
          }
        }
      }
    }
  });
};

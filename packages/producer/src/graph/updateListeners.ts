import { DB } from "jsonmvc-datastore";
import set from "lodash/set";
import {
  GraphNodeType,
  OperationTypes,
  GraphInternalNode,
  GraphData,
  GraphStructure,
  GraphNode,
} from "@c11/engine-types";
import { computeDependenciesForNode } from "./computeDependenciesForNode";
import { getOperation } from "./getOperation";
import { funcOperation } from "./funcOperation";
import { computeOperation, ComputeType } from "./computeOperation";
import { pathListener } from './pathListener'
import { Graph } from "./graph";

export const updateListeners = (
  _this: Graph,
  update: Function,
  db: DB,
  data: GraphData,
  structure: GraphStructure,
  node: GraphNode
) => {
  const deps = computeDependenciesForNode(update, db, data, structure, node);

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

  deps.listeners.forEach(x => {
    const node = structure[x];
    if (node.type === GraphNodeType.INTERNAL) {
      if (node.removeListener) {
        node.removeListener();
      }
      if (node.path) {
        node.removeListener = db.on(
          node.path,
          pathListener(_this, update, db, data, structure, node)
        );
        node.value = db.get(node.path);
        set(_this.data, node.nesting, node.value);
      }
    }
  });
  deps.funcListeners.forEach(x => {
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

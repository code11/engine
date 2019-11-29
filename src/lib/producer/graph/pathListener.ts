import { computeDependenciesForNode } from './computeDependenciesForNode';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import { GraphData, GraphStructure, GraphNode, GraphNodeType } from '.';
import { DB } from 'jsonmvc-datastore';
import { OperationTypes } from '..';
import { getOperation } from './getOperation';
import { funcOperation } from './funcOperation';

export const pathListener = (
  cb: Function,
  db: DB,
  data: GraphData,
  structure: GraphStructure,
  node: GraphNode
) => {
  return (newValue: any) => {
    if (newValue === node.value) {
      return;
    }
    node.value = newValue;
    set(data, node.nesting, node.value);
    const updateListeners = computeDependenciesForNode(
      cb,
      db,
      data,
      structure,
      node
    );
    updateListeners.listeners.forEach(x => {
      const node = structure[x];
      if (node.type === GraphNodeType.INTERNAL) {
        if (node.removeListener) {
          node.removeListener();
        }
        if (node.path) {
          node.removeListener = db.on(
            node.path,
            pathListener(cb, db, data, structure, node)
          );
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
                  cb(cloneDeep(data));
                }
              });
            }
          }
        }
      }
    });

    cb(cloneDeep(data));
  };
};

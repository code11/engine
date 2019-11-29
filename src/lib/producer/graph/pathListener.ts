import { computeDependenciesForNode } from './computeDependenciesForNode';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import { GraphData, GraphStructure, GraphNode, GraphNodeType } from '.';
import { DB } from 'jsonmvc-datastore';

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
    updateListeners.forEach(x => {
      let node = structure[x];
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
    cb(cloneDeep(data));
  };
};

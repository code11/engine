import { DB } from 'jsonmvc-datastore';
import set from 'lodash/set';
import { GraphStructure, GraphNodeType, GraphNode } from '.';
import { computeOperation, ComputeType } from './computeOperation';

export const computeDependenciesForNode = (
  cb: Function,
  db: DB,
  data: any,
  structure: GraphStructure,
  node: GraphNode
) => {
  let listeners: string[] = [];
  node.isDependedBy.forEach(x => {
    const dep = structure[x];
    if (dep.type === GraphNodeType.INTERNAL) {
      const result = computeOperation(db, structure, dep);

      if (result.type === ComputeType.PATH) {
        listeners.push(x);
      }

      if (result.value) {
        if (result.type === ComputeType.PATH) {
          dep.path = result.value;
          dep.value = db.get(result.value);
          // dep.removeListener =
        } else if (result.type === ComputeType.VALUE) {
          dep.value = result.value;
        }
      }
      set(data, dep.nesting, dep.value);
      listeners = listeners.concat(
        computeDependenciesForNode(cb, db, data, structure, dep)
      );
    }
  });
  return listeners;
};

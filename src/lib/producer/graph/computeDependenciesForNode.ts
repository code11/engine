import { DB } from 'jsonmvc-datastore';
import set from 'lodash/set';
import isEqual from 'lodash/isEqual';
import { GraphStructure, GraphNodeType, GraphNode } from '.';
import { computeOperation, ComputeType } from './computeOperation';
import { OperationTypes, ValueTypes } from '..';
import { getOperation } from './getOperation';
import { funcOperation } from './funcOperation';

export const computeDependenciesForNode = (
  cb: Function,
  db: DB,
  data: any,
  structure: GraphStructure,
  node: GraphNode
) => {
  let listeners: string[] = [];
  let funcListeners: { id: string; param: number }[] = [];
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
      const newListeners = computeDependenciesForNode(
        cb,
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
            op.path.forEach(z => {
              if (z.type === ValueTypes.INTERNAL) {
                if (isEqual(z.path, node.nestingPath)) {
                  funcListeners.push({
                    id: dep.id,
                    param: i
                  });
                  /*
                  if (dep.removeFuncListeners[i]) {
                    dep.removeFuncListeners[i]();
                  }
                  const path = getOperation(structure, op);
                  if (path) {
                    dep.removeFuncListeners[i] = db.on(path, val => {
                      if (dep.op.type === OperationTypes.FUNC) {
                        const result = funcOperation(db, structure, dep.op);
                        dep.value = result;
                        console.log('FInal is', dep.value);
                        set(data, dep.nesting, dep.value);
                      }
                    });
                  }
                  */
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

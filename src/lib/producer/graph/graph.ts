import merge from 'lodash/merge';
import set from 'lodash/set';
import { StructOperation, OperationTypes } from '..';
import { GraphStructure, GraphNodeType } from '.';
import { resolveDependencies } from './resolveDependencies';
import { getExternalNodes } from './getExternalNodes';
import { getInternalNodes } from './getInternalNodes';
import { resolveOrder } from './resolveOrder';
import { resolveValue } from './resolveValue';
import { getInvokablePath } from './getInvokablePath';
import { DB } from 'jsonmvc-datastore';

interface Data {
  [key: string]: any;
}

export class Graph {
  private structure: GraphStructure;
  private order: string[];
  db: DB;
  data: Data = {};
  constructor(db: DB, props: any, op: StructOperation) {
    const struct = merge(getInternalNodes(op), getExternalNodes(props));
    resolveDependencies(struct);
    this.structure = struct;
    this.db = db;
    this.order = resolveOrder(struct);
  }
  compute() {
    const data = this.order.reduce((acc, x) => {
      const node = this.structure[x];
      if (node.type === GraphNodeType.INTERNAL) {
        if (node.op.type === OperationTypes.GET) {
          const path = node.op.path.map((x: any) => {
            return resolveValue(this.structure, x);
          });
          const finalPath = '/' + path.join('/');
          node.path = finalPath;
          node.value = this.db.get(finalPath);
          set(acc, node.nesting, node.value);
        } else if (node.op.type === OperationTypes.VALUE) {
          const value = resolveValue(this.structure, node.op.value);
          node.value = value;
          set(acc, node.nesting, node.value);
        } else if (
          node.op.type === OperationTypes.MERGE ||
          node.op.type === OperationTypes.SET
        ) {
          const opType =
            node.op.type === OperationTypes.MERGE ? 'merge' : 'add';
          const fn = (value: any, params: any) => {
            const path = getInvokablePath(this.structure, node.op, params);
            if (path) {
              const patch = {
                op: opType,
                path,
                value: value
              };
              this.db.patch([patch]);
            }
          };
          set(acc, node.nesting, fn);
        } else if (node.op.type === OperationTypes.REF) {
          const refGet = (params: any) => {
            const path = getInvokablePath(this.structure, node.op, params);
            if (path) {
              return this.db.get(path);
            }
          };
          const refMerge = (value: any, params: any) => {
            const path = getInvokablePath(this.structure, node.op, params);
            if (path) {
              const patch = {
                op: 'merge',
                path,
                value: value
              };
              this.db.patch([patch]);
            }
          };
          const refSet = (value: any, params: any) => {
            const path = getInvokablePath(this.structure, node.op, params);
            if (path) {
              const patch = {
                op: 'add',
                path,
                value: value
              };
              this.db.patch([patch]);
            }
          };
          const ref = {
            merge: refMerge,
            get: refGet,
            set: refSet
          };
          set(acc, node.nesting, ref);
        }

        // result can be a path or an actual value
        // set(acc, node.nesting, result);
      }
      return acc;
    }, {});
    return data;
  }
}

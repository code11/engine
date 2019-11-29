import merge from 'lodash/merge';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import { StructOperation, OperationTypes } from '..';
import { GraphData, GraphStructure, GraphNodeType } from '.';
import { resolveDependencies } from './resolveDependencies';
import { getExternalNodes } from './getExternalNodes';
import { getInternalNodes } from './getInternalNodes';
import { resolveOrder } from './resolveOrder';
import { DB } from 'jsonmvc-datastore';
import { getOperation } from './getOperation';
import { ComputeType, computeOperation } from './computeOperation';
import { pathListener } from './pathListener';
import { funcOperation } from './funcOperation';

export class Graph {
  private structure: GraphStructure;
  private order: string[];
  db: DB;
  data: GraphData = {};
  cb: Function;
  constructor(db: DB, props: any, op: StructOperation, cb: Function) {
    const struct = merge(getInternalNodes(op), getExternalNodes(props));
    resolveDependencies(struct);
    this.structure = struct;
    this.db = db;
    this.order = resolveOrder(struct);
    this.cb = cb;
  }
  compute() {
    const data = this.order.reduce((acc, x) => {
      const node = this.structure[x];
      if (node.type === GraphNodeType.INTERNAL) {
        const result = computeOperation(this.db, this.structure, node);
        if (result.value) {
          if (result.type === ComputeType.PATH) {
            node.path = result.value;
            node.value = this.db.get(result.value);
          } else if (result.type === ComputeType.VALUE) {
            node.value = result.value;
          }
        }
        set(acc, node.nesting, node.value);
      }
      return acc;
    }, {});
    return data;
  }

  listen() {
    this.data = this.compute();
    this.cb(cloneDeep(this.data));

    // console.log(JSON.stringify(this.structure, null, ' '));

    this.order.forEach(x => {
      const node = this.structure[x];
      if (node.type === GraphNodeType.INTERNAL) {
        if (node.op.type === OperationTypes.GET) {
          const path = getOperation(this.structure, node.op);
          if (path) {
            if (node.removeListener) {
              node.removeListener();
            }
            node.removeListener = this.db.on(
              path,
              pathListener(this.cb, this.db, this.data, this.structure, node)
            );
          }
        } else if (node.op.type === OperationTypes.FUNC) {
          node.op.value.params.forEach((op, i) => {
            if (op.type === OperationTypes.GET) {
              const path = getOperation(this.structure, op);
              if (node.removeFuncListeners[i]) {
                node.removeFuncListeners[i]();
              }
              if (path) {
                node.removeFuncListeners[i] = this.db.on(path, val => {
                  if (node.op.type === OperationTypes.FUNC) {
                    const result = funcOperation(
                      this.db,
                      this.structure,
                      node.op
                    );
                  }
                });
              }
            }
          });
        }
      }
    });
  }
}

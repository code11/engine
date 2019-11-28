import merge from 'lodash/merge';
import set from 'lodash/set';
import { StructOperation, OperationTypes } from '..';
import { GraphStructure, GraphNodeType } from '.';
import { resolveDependencies } from './resolveDependencies';
import { getExternalNodes } from './getExternalNodes';
import { getInternalNodes } from './getInternalNodes';
import { resolveOrder } from './resolveOrder';
import { DB } from 'jsonmvc-datastore';
import { getOperation } from './getOperation';
import { isValidPath } from './isValidPath';
import { valueOperation } from './valueOperation';
import { updateOperation } from './updateOperation';
import { refOperation } from './refOperation';
import { funcOperation } from './funcOperation';

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
          const path = getOperation(this.structure, node.op);
          if (path && isValidPath(path)) {
            node.path = path;
            node.value = this.db.get(node.path);
          }
        } else if (node.op.type === OperationTypes.VALUE) {
          node.value = valueOperation(this.structure, node.op);
        } else if (
          node.op.type === OperationTypes.MERGE ||
          node.op.type === OperationTypes.SET
        ) {
          node.value = updateOperation(this.db, this.structure, node.op);
        } else if (node.op.type === OperationTypes.REF) {
          node.value = refOperation(this.db, this.structure, node.op);
        } else if (node.op.type === OperationTypes.FUNC) {
          node.value = funcOperation(this.db, this.structure, node.op);
        }
        set(acc, node.nesting, node.value);
      }
      return acc;
    }, {});
    return data;
  }
}

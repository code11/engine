import merge from 'lodash/merge';
import set from 'lodash/set';
import {
  Operation,
  StructOperation,
  OperationTypes,
  GetOperation,
  ValueOperation,
  MergeOperation,
  SetOperation,
  RefOperation,
  FuncOperation
} from '..';
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

const isValidPath = (path: any) => {
  return !(!path || path.includes(undefined) || path.includes(null));
};

const getOperation = (structure: GraphStructure, op: GetOperation) => {
  const path = op.path.map((x: any) => {
    return resolveValue(structure, x);
  });
  if (isValidPath(path)) {
    const finalPath = '/' + path.join('/');
    return finalPath;
  } else {
    return;
  }
};

const valueOperation = (structure: GraphStructure, op: ValueOperation) => {
  const value = resolveValue(structure, op.value);
  return value;
};

const updateOperation = (
  db: DB,
  structure: GraphStructure,
  op: MergeOperation | SetOperation
) => {
  const opType = op.type === OperationTypes.MERGE ? 'merge' : 'add';
  const fn = (value: any, params: any) => {
    const path = getInvokablePath(structure, op, params);
    if (path) {
      const patch = {
        op: opType,
        path,
        value: value
      };
      db.patch([patch]);
    }
  };
  return fn;
};

const refOperation = (db: DB, structure: GraphStructure, op: RefOperation) => {
  const refGet = (params: any) => {
    const path = getInvokablePath(structure, op, params);
    if (path) {
      return db.get(path);
    }
  };
  const refMerge = (value: any, params: any) => {
    const path = getInvokablePath(structure, op, params);
    if (path) {
      const patch = {
        op: 'merge',
        path,
        value: value
      };
      db.patch([patch]);
    }
  };
  const refSet = (value: any, params: any) => {
    const path = getInvokablePath(structure, op, params);
    if (path) {
      const patch = {
        op: 'add',
        path,
        value: value
      };
      db.patch([patch]);
    }
  };
  const ref = {
    merge: refMerge,
    get: refGet,
    set: refSet
  };
  return ref;
};

const funcOperation = (
  db: DB,
  structure: GraphStructure,
  op: FuncOperation
) => {
  console.log('executing func', op.value.params);

  const getParams = (params: any) => {
    const result = params.map((x: any) => {
      if (x.type === OperationTypes.GET) {
        const path = getOperation(structure, x);
        if (path) {
        }
      }
      console.log(x);
    });
    return result;
  };
  // const params = getParams(op.value.params);
  // TODO: Add try catch here
  // const value = op.value.fn.apply(null, params);
  const value = '123';
  return value;
};

export class Graph {
  private structure: GraphStructure;
  private order: string[];
  db: DB;
  data: Data = {};
  constructor(db: DB, props: any, op: StructOperation) {
    const struct = merge(getInternalNodes(op), getExternalNodes(props));
    resolveDependencies(struct);
    this.structure = struct;
    // console.log(struct);
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

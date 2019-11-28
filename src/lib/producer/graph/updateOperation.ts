import { DB } from 'jsonmvc-datastore';
import { GraphStructure } from '.';
import { OperationTypes, MergeOperation, SetOperation } from '..';
import { getInvokablePath } from './getInvokablePath';

export const updateOperation = (
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

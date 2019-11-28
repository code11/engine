import { DB } from 'jsonmvc-datastore';
import { GraphStructure } from '.';
import { RefOperation } from '..';
import { getInvokablePath } from './getInvokablePath';

export const refOperation = (
  db: DB,
  structure: GraphStructure,
  op: RefOperation
) => {
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

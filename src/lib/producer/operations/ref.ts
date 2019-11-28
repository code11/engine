import { OperationResolver, ValueTypes, RefOperation, RefDataType } from '..';
import { resolveValue } from '../resolveValue';

export const refOperation: OperationResolver<RefOperation> = (
  db,
  external,
  data,
  op
) => {
  const refGet = (params: any) => {
    const setPath = op.path.map((x: any) => {
      if (x.type === ValueTypes.INVOKE) {
        return params && params[x.name];
      } else {
        return resolveValue(external, data, x);
      }
    });
    const finalPath = '/' + setPath.join('/');
    return db.get(finalPath);
  };
  const refSet = (value: any, params: any) => {
    const setPath = op.path.map((x: any) => {
      if (x.type === ValueTypes.INVOKE) {
        return params && params[x.name];
      } else {
        return resolveValue(external, data, x);
      }
    });
    const finalPath = '/' + setPath.join('/');
    db.patch([
      {
        op: 'add',
        path: finalPath,
        value: value
      }
    ]);
  };
  const refMerge = (value: any, params: any) => {
    const setPath = op.path.map((x: any) => {
      if (x.type === ValueTypes.INVOKE) {
        return params && params[x.name];
      } else {
        return resolveValue(external, data, x);
      }
    });
    const finalPath = '/' + setPath.join('/');
    db.patch([
      {
        op: 'merge',
        path: finalPath,
        value: value
      }
    ]);
  };

  const ref: RefDataType = {
    merge: refMerge,
    get: refGet,
    set: refSet
  };
  return ref;
};

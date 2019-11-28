import { OperationResolver, ValueTypes, SetOperation } from '..';
import { resolveValue } from '../resolveValue';

export const setOperation: OperationResolver<SetOperation> = (
  db,
  external,
  data,
  op
) => {
  const setFn = (value: any, params: any) => {
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
  return setFn;
};

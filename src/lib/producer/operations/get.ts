import { OperationResolver, GetOperation } from '..';
import { resolveValue } from '../resolveValue';

export const getOperation: OperationResolver<GetOperation> = (
  db,
  external,
  data,
  op
) => {
  const getPath = op.path.map((x: any) => {
    return resolveValue(external, data, x);
  });
  const finalPath = '/' + getPath.join('/');
  return db.get(finalPath);
};

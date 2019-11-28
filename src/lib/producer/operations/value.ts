import { OperationResolver, ValueOperation } from '..';
import { resolveValue } from '../resolveValue';

export const valueOperation: OperationResolver<ValueOperation> = (
  db,
  external,
  data,
  op
) => {
  return resolveValue(external, data, op.value);
};

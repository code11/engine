import { GraphStructure } from '.';
import { ValueOperation } from '..';
import { resolveValue } from './resolveValue';

export const valueOperation = (
  structure: GraphStructure,
  op: ValueOperation
) => {
  const value = resolveValue(structure, op.value);
  return value;
};

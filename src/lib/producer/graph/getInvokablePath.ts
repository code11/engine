import { GraphStructure } from '.';
import { SetOperation, RefOperation, MergeOperation } from '..';
import { resolveValue } from './resolveValue';

export const getInvokablePath = (
  structure: GraphStructure,
  op: MergeOperation | SetOperation | RefOperation,
  params: any
) => {
  const path = op.path.map((x: any) => {
    return resolveValue(structure, x, params);
  });
  if (path.includes(undefined) || path.includes(null)) {
    return;
  } else {
    return '/' + path.join('/');
  }
};

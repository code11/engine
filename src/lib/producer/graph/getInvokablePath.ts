import { GraphStructure } from '.';
import { Operation, OperationTypes } from '..';
import { resolveValue } from './resolveValue';

export const getInvokablePath = (
  structure: GraphStructure,
  op: Operation,
  params: any
) => {
  if (
    op.type === OperationTypes.MERGE ||
    op.type === OperationTypes.SET ||
    op.type === OperationTypes.REF
  ) {
    const path = op.path.map((x: any) => {
      return resolveValue(structure, x, params);
    });
    if (path.includes(undefined) || path.includes(null)) {
      return;
    } else {
      return '/' + path.join('/');
    }
  } else {
    return;
  }
};

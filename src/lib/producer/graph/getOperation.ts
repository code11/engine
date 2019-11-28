import { GraphStructure } from '.';
import { GetOperation } from '..';
import { isValidPath } from './isValidPath';
import { resolveValue } from './resolveValue';

export const getOperation = (structure: GraphStructure, op: GetOperation) => {
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

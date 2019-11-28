import { OperationResolvers, OperationTypes } from '..';
import { valueOperation } from './value';
import { getOperation } from './get';
import { setOperation } from './set';
import { mergeOperation } from './merge';
import { refOperation } from './ref';
import { structOperation } from './struct';
import { funcOperation } from './func';
export {
  getOperation,
  setOperation,
  mergeOperation,
  refOperation,
  structOperation,
  funcOperation,
  valueOperation
};

export const operations: OperationResolvers = {
  ['VALUE' as OperationTypes.VALUE]: valueOperation,
  ['GET' as OperationTypes.GET]: getOperation,
  ['SET' as OperationTypes.SET]: setOperation,
  ['MERGE' as OperationTypes.MERGE]: mergeOperation,
  ['STRUCT' as OperationTypes.STRUCT]: structOperation,
  ['FUNC' as OperationTypes.FUNC]: funcOperation,
  ['REF' as OperationTypes.REF]: refOperation
};

import { ObjectProperty } from '@babel/types';
import * as Babel from '@babel/core';
import { Operation, OperationTypes, ValueTypes } from '../lib/producer/types';

export const processValue = (
  t: typeof Babel.types,
  node: ObjectProperty
): Operation | void => {
  if (t.isAssignmentPattern(node.value)) {
  } else if (t.isIdentifier(node.value)) {
    return {
      type: OperationTypes.GET,
      path: [
        {
          type: ValueTypes.EXTERNAL,
          path: [node.key.name]
        }
      ]
    };
  }
};

import { ObjectPattern, ObjectProperty } from '@babel/types';
import * as Babel from '@babel/core';
import { OperationTypes, StructOperation } from '../lib/producer/types';
import { processValue } from './processValue';

export const processStruct = (
  t: typeof Babel.types,
  obj: ObjectPattern
): StructOperation => {
  const result = obj.properties.reduce(
    (acc, x) => {
      if (t.isObjectProperty(x)) {
        const node = x as ObjectProperty;
        const propName = node.key.name;
        const propValue = processValue(t, node);
        if (propValue) {
          acc.value[propName] = propValue;
        }
      }
      return acc;
    },
    {
      type: OperationTypes.STRUCT,
      value: {}
    } as StructOperation
  );
  return result;
};

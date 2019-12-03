import { flatten } from 'lodash';
import {
  ValueTypes,
  InternalValue,
  ExternalValue,
  StaticValue
} from '../../lib/producer/types';
import { PathSymbol } from '../types';

export const propPathValueParser = (path: string[]): StaticValue => {
  const first = path[0];
  const symbol = first[0];
  let path2 = path.slice();
  path2[0] = path2[0].slice(1);
  path2 = flatten(path2.map(x => x.split('.')));
  if (symbol === PathSymbol.INTERNAL) {
    return {
      type: ValueTypes.INTERNAL,
      path: path2
    } as InternalValue;
  } else if (symbol === PathSymbol.EXTERNAL) {
    return {
      type: ValueTypes.EXTERNAL,
      path: path2
    } as ExternalValue;
  } else {
    throw new Error(
      'The first char of the prop needs to be a symbol: ' +
        PathSymbol.INTERNAL +
        ' or ' +
        PathSymbol.EXTERNAL
    );
  }
};

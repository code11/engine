import {
  ValueTypes,
  InvokableValue,
  InternalValue,
  ExternalValue,
  InvokeValue,
  ConstValue,
  StaticValue
} from '../lib/producer/types';
import { PathSymbol } from './types';

export const processInvokablePathValue = (path: string[]): InvokableValue[] => {
  const result = path.map(x => {
    const symbol = x[0];
    if (symbol === PathSymbol.INTERNAL) {
      return {
        type: ValueTypes.INTERNAL,
        path: x.slice(1).split('.')
      } as InternalValue;
    } else if (symbol === PathSymbol.EXTERNAL) {
      return {
        type: ValueTypes.EXTERNAL,
        path: x.slice(1).split('.')
      } as ExternalValue;
    } else if (symbol === PathSymbol.INVOKABLE) {
      return {
        type: ValueTypes.INVOKE,
        name: x.slice(1)
      } as InvokeValue;
    } else {
      return {
        type: ValueTypes.CONST,
        value: x
      } as ConstValue;
    }
  });
  return result;
};

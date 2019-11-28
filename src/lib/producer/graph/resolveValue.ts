import { GraphStructure } from '.';
import { ValueTypes, InvokableValue } from '..';
import { getValue } from './getValue';

export const resolveValue = (
  structure: GraphStructure,
  value: InvokableValue,
  invokable?: any
) => {
  if (value.type === ValueTypes.CONST) {
    return value.value;
  } else if (value.type === ValueTypes.EXTERNAL) {
    return getValue('external', structure, value.path);
  } else if (value.type === ValueTypes.INTERNAL) {
    return getValue('internal', structure, value.path);
  } else if (value.type === ValueTypes.INVOKE) {
    return invokable[value.name];
  }
};

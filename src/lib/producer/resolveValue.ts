import get from 'lodash/get';
import { ValueTypes, StaticValue } from '.';

export const resolveValue = (external: any, data: any, value: StaticValue) => {
  if (value.type === ValueTypes.CONST) {
    return value.value;
  } else if (value.type === ValueTypes.EXTERNAL) {
    return get(external, value.path);
  } else if (value.type === ValueTypes.INTERNAL) {
    return get(data, value.path);
  }
};

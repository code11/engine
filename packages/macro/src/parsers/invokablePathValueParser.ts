import {
  ValueTypes,
  InvokableValue,
  InternalValue,
  ExternalValue,
  InvokeValue,
  ConstValue,
  PathSymbol,
} from "@c11/engine-types";

export const invokablePathValueParser = (path: string[]): InvokableValue[] => {
  const result = path.map(x => {
    const symbol = x[0];
    if (symbol === PathSymbol.INTERNAL) {
      return {
        type: ValueTypes.INTERNAL,
        path: x.slice(1).split("."),
      } as InternalValue;
    } else if (symbol === PathSymbol.EXTERNAL) {
      return {
        type: ValueTypes.EXTERNAL,
        path: x.slice(1).split("."),
      } as ExternalValue;
    } else if (symbol === PathSymbol.INVOKABLE) {
      return {
        type: ValueTypes.INVOKE,
        path: x.slice(1).split("."),
      } as InvokeValue;
    } else {
      return {
        type: ValueTypes.CONST,
        value: x,
      } as ConstValue;
    }
  });
  return result;
};

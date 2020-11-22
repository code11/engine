import { InvokableValue, ValueTypes } from "@c11/engine.types";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";

export const stringifyPath = (path: InvokableValue[]): string | void => {
  if (!path) {
    return;
  }

  const result = path
    .reduce((acc, x) => {
      if (x.type === ValueTypes.CONST) {
        if (isString(x.value)) {
          acc.push(x.value);
        } else if (isNumber(x.value)) {
          acc.push(x.value.toString());
        } else {
          acc.push("<?>");
        }
      } else if (x.type === ValueTypes.EXTERNAL) {
        acc.push(`<prop.${x.path.join(".")}>`);
      } else if (x.type === ValueTypes.INTERNAL) {
        acc.push(`<arg.${x.path.join(".")}>`);
      } else if (x.type === ValueTypes.INVOKE) {
        acc.push(`<param.${x.path.join(".")}>`);
      } else {
        acc.push("<unknown>");
      }

      return acc;
    }, [] as string[])
    .join(".");

  return result;
};

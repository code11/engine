import isString from "lodash/isString";
import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";
import toNumber from "lodash/toNumber";
import {
  ObjectExpression,
  objectExpression,
  ObjectProperty,
  identifier,
  stringLiteral,
  objectProperty,
  numericLiteral,
  arrayExpression,
} from "@babel/types";

export const rawObjectCompiler = (obj: any): ObjectExpression => {
  const props = Object.keys(obj).reduce((acc, x) => {
    let val: any = obj[x];
    let result;
    if (isString(val)) {
      result = stringLiteral(val);
    } else if (typeof val === "number") {
      result = numericLiteral(toNumber(val));
    } else if (isArray(val)) {
      let list = val.map(x => stringLiteral(x));
      result = arrayExpression(list);
    } else if (isPlainObject(val)) {
      result = rawObjectCompiler(val);
    } else {
      throw new Error("Meta type for " + val + " not supported");
    }
    if (result) {
      acc.push(objectProperty(identifier(x), result));
    }
    return acc;
  }, [] as ObjectProperty[]);

  return objectExpression(props);
};

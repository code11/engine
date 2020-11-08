import * as Babel from "@babel/core";
import isString from "lodash/isString";
import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";
import toNumber from "lodash/toNumber";
import { ObjectExpression, ObjectProperty } from "@babel/types";

export const rawObjectCompiler = (
  babel: typeof Babel,
  obj: any
): ObjectExpression => {
  const t = babel.types;
  const props = Object.keys(obj).reduce((acc, x) => {
    let val: any = obj[x];
    let result;
    if (isString(val)) {
      result = t.stringLiteral(val);
    } else if (typeof val === "number") {
      result = t.numericLiteral(toNumber(val));
    } else if (isArray(val)) {
      let list = val.map((x) => t.stringLiteral(x));
      result = t.arrayExpression(list);
    } else if (isPlainObject(val)) {
      result = rawObjectCompiler(babel, val);
    } else if (val === undefined) {
      result = t.identifier("undefined");
    } else {
      throw new Error("Meta type for " + val + " not supported");
    }
    if (result) {
      acc.push(t.objectProperty(t.identifier(x), result));
    }
    return acc;
  }, [] as ObjectProperty[]);

  return t.objectExpression(props);
};

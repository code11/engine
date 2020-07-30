import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";

// @TODO: Concat these implementation to reduce
// fn calls
function isValidValue(value) {
  return value !== undefined;
}

export default isValidValue;

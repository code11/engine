import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";

// @TODO: Concat these implementation to reduce
// fn calls
function isValidValue(value) {
  let type = typeof value;
  return (
    value !== undefined &&
    (value === null ||
      isBoolean(value) ||
      isNumber(value) ||
      isString(value) ||
      isArray(value) ||
      isPlainObject(value))
  );
}

export default isValidValue;

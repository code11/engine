import isString from "lodash/isString";

function isValidPath(path) {
  return isString(path) && /^(\/[a-z0-9~\\\-%^|"\ _]*)+$/gi.test(path);
}

export default isValidPath;

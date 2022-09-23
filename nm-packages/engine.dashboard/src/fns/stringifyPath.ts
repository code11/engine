import { enumTest } from "../enumTest";

export const stringifyPath = (path) => {
  path = path.slice();
  path.shift();
  path = path.map((x) => {
    if (!x) {
      return "*";
    } else if (x.__node__) {
      return "*";
    } else if (0 === x.indexOf("[")) {
      if (enumTest.test(x)) {
        return x;
      }
      return "*";
    } else {
      return x;
    }
  });

  return path.join("-");
};

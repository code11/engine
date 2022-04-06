export const stringifyPath = (path) => {
  path = path.slice();
  path.shift();
  path = path.map((x) => {
    if (0 === x.indexOf("[")) {
      return "*";
    } else {
      return x;
    }
  });

  return path.join("-");
};

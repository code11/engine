import clone from "clone-deep";
import { PathSymbol } from "./symbol";
import { isPath } from "./isPath";

const createPath = (...args) => {
  args = args.reduce((acc, x) => {
    if (isPath(x)) {
      acc = acc.concat(x.__expand__());
    } else {
      acc.push(x);
    }
    return acc;
  }, []);
  const current = clone(args);
  const path = (...newArgs) => {
    newArgs = newArgs.reduce((acc, x) => {
      if (isPath(x)) {
        acc = acc.concat(x.__expand__());
      } else {
        acc.push(x);
      }
      return acc;
    }, []);
    const result = current.concat(newArgs);
    return createPath(...result);
  };

  Object.defineProperty(path, "__symbol__", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: PathSymbol,
  });

  Object.defineProperty(path, "__expand__", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: () => current,
  });

  return path;
};

export const pathFn = (...args) => {
  return createPath(...args);
};

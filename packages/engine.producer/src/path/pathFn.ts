import clone from "clone-deep";
import { PathSymbol } from "./symbol";
import { isPath } from "./isPath";

export const pathFn = (...args: any[]) => {
  args = args.reduce((acc, x) => {
    if (isPath(x)) {
      acc = acc.concat(x.__expand__());
    } else {
      acc.push(x);
    }
    return acc;
  }, []);
  const current = clone(args);
  const path = (...newArgs: any[]) => {
    newArgs = newArgs.reduce((acc, x) => {
      if (isPath(x)) {
        acc = acc.concat(x.__expand__());
      } else {
        acc.push(x);
      }
      return acc;
    }, []);
    const result = current.concat(newArgs);
    return pathFn(...result);
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

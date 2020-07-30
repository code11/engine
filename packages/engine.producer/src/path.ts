import clone from "clone-deep";
class PathObject {}

function createProxy(path: any[] = [], obj = new PathObject()): any {
  return new Proxy(obj, {
    get(target, prop) {
      if (prop === Symbol.toStringTag) {
        return true;
      } else if (prop === Symbol.toPrimitive) {
        return (hint: any) => path.join(".");
      } else if (prop === "constructor") {
        return PathObject;
      } else if (prop === "__symbol__") {
        return PathSymbol;
      } else {
        const result = clone(path);
        result.push(prop);
        return createProxy(result, obj);
      }
    },
  });
}

export const PathSymbol = Symbol("path");

export const Path: any = new Proxy(
  {},
  {
    get(target, prop) {
      return createProxy([prop]);
    },
  }
);

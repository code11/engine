class PathObject {}
const Obj = new PathObject();

function createProxy(path: any[] = []): any {
  return new Proxy(Obj, {
    get(target, prop) {
      if (prop === Symbol.toStringTag) {
        return true;
      } else if (prop === Symbol.toPrimitive) {
        return path;
      } else if (prop === "length") {
        return path.length;
      } else if (prop === "constructor") {
        return PathObject;
      } else if (prop === "__symbol__") {
        return PathSymbol;
      } else {
        path.push(prop);
        return createProxy(path);
      }
    },
  });
}

export const PathSymbol = Symbol("path");

export const Path = createProxy();

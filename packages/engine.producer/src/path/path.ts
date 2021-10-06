import clone from "clone-deep";
import { PathSymbol } from "./symbol";
export class PathObject {}

function createProxy(path: any[] = [], obj = new PathObject()): any {
  return new Proxy(obj, {
    get(target, prop) {
      if (prop === Symbol.toStringTag) {
        return true;
      } else if (prop === "__expand__") {
        return (hint: any) => path;
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

export const path: any = typeof Proxy === "undefined" ? null : createProxy();

import { AccessMethods } from "@c11/engine.types";
import decomposePath from "./decomposePath";
import getNode from "./getNode";
import pathExists from "./pathExists";
import splitPath from "./splitPath";
import { triggerListenerFn } from "./triggerListener";

export function triggerWildcardFn(db, path, fnId, patch = []) {
  let fns = db.updates.fns[path];

  if (!fns || !fns[fnId] || !fns[fnId].fn) {
    return;
  }

  let refinee = fns[fnId].refinee;

  const parts = splitPath(path);
  const idx = parts.indexOf("*");
  const root = "/" + parts.slice(0, idx).join("/");
  const sufix = parts.slice(idx + 1);

  if (refinee.type === AccessMethods.isObserved) {
    const triggers = db.updates.triggers[root];
    if (!triggers) {
      return;
    }
    const selected = triggers.filter((x) => x !== path);
    let len = selected.length;

    while (len--) {
      triggerListenerFn(db, path, fnId, [{ path: selected[len], op: "test" }]);
    }
  } else {
    const node = getNode(db, root);
    if (node) {
      Object.keys(node).forEach((x) => {
        if (node[x] && sufix.length > 0) {
          let nodePath = `${root}/${x}/${sufix.join("/")}`;
          if (pathExists(db, nodePath)) {
            triggerListenerFn(db, path, fnId, [{ path: nodePath, op: "test" }]);
          }
        } else {
          triggerListenerFn(db, path, fnId, [
            { path: `${root}/${x}`, op: "test" },
          ]);
        }
      });
    }
  }
}

import "setimmediate";
import { randomId } from "@c11/engine.utils";
import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";
import { getRefinedValue } from "./getRefinedValue";
import err from "./err";
import { Patch } from "@c11/engine.types";
import { isWildcardPath } from "./isWildcardPath";

function callNode(db, path, i, patch: Patch[] = []) {
  let fns = db.updates.fns[path];

  if (!fns || !fns[i] || !fns[i].fn) {
    return;
  }

  let fn = fns[i].fn;
  let refinee = fns[i].refinee;
  let isWildcard = isWildcardPath(path);

  // Wildcard triggers need concrete values to have meaning
  // as such wildcard existance shouldn't trigger other wildcard paths
  if (
    isWildcard &&
    patch[0] &&
    patch[0].op === "test" &&
    isWildcardPath(patch[0].path)
  ) {
    return;
  }

  let val = getRefinedValue(db, path, patch, refinee);

  const replacer = (key, value) => {
    if (isPlainObject(value) || isArray(value) || value !== Object(value)) {
      return value;
    } else if (typeof value === "symbol" || value instanceof Symbol) {
      return value.toString();
    }
    return randomId();
  };
  let cacheTest = JSON.stringify(val, replacer);
  let cacheIndex = isWildcard && patch[0] ? i + "-" + patch[0].path : i;

  if (
    !db.updates.cache[path].hasOwnProperty(cacheIndex) ||
    db.updates.cache[path][cacheIndex] !== cacheTest
  ) {
    db.updates.cache[path][cacheIndex] = cacheTest;
    (function () {
      try {
        fn.call(null, val, patch);
      } catch (e) {
        if (e instanceof Error) {
          err(db, "/err/types/on/2", {
            path: path,
            error: e.message + " " + e.stack,
            errObj: e,
          });
        }
      }
    })();
  }
}

function triggerListener(db, path, patch = []) {
  let fns = db.updates.fns[path];

  if (!fns) {
    return;
  }

  let ids = Object.keys(fns);
  let len = ids.length;

  for (let i = 0; i < len; i += 1) {
    setImmediate(() => {
      callNode(db, path, ids[i], patch);
    });
  }
}

export function triggerListenerFn(db, path, fnId, patch: Patch[] = []) {
  setImmediate(() => {
    callNode(db, path, fnId, patch);
  });
}

export default triggerListener;

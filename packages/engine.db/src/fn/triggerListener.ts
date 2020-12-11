import "setimmediate";
import getNode from "./getNode";
import err from "./err";
import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";

function callNode(db, path, i, patch = []) {
  let fns = db.updates.fns[path];

  if (!fns || !fns[i]) {
    return;
  }

  let fn = fns[i];

  let val = getNode(db, path, patch);

  const replacer = (key, value) => {
    if (isPlainObject(value) || isArray(value) || value !== Object(value)) {
      return value;
    }
    return undefined;
  };
  let cacheTest = JSON.stringify(val, replacer);

  if (db.updates.cache[path][i] !== cacheTest) {
    db.updates.cache[path][i] = cacheTest;
    (function () {
      try {
        fn.call(null, val, patch);
      } catch (e) {
        err(db, "/err/types/on/2", {
          path: path,
          error: e.message + " " + e.stack,
          errObj: e,
        });
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

export function triggerListenerFn(db, path, fnId, patch) {
  setImmediate(() => {
    callNode(db, path, fnId, patch);
  });
}

export default triggerListener;

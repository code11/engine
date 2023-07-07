import isFunction from "lodash/isFunction";
import getStaticNodes from "../fn/getStaticNodes";
import triggerListener, { triggerListenerFn } from "../fn/triggerListener";
import decomposePath from "../fn/decomposePath";
import updateTriggers from "../fn/updateTriggers";
import patch from "./patch";
import err from "../fn/err";
import { isWildcardPath } from "../fn/isWildcardPath";
import { AccessMethods } from "@c11/engine.types";
import { triggerWildcardFn } from "../fn/triggerWildcardFn";
import pathTriggers from "../fn/pathTriggers";

let listenerId = 0;

/**
 * on
 *
 * Adds a listener
 *
 * - when a listener is first added a check is made
 *   on the path and if it exists then the listener
 *   is executed (async!)
 */
const on =
  (db) =>
  (path, fn, refinee = { type: AccessMethods.value, args: [] }) => {
    let obj = {
      path: path,
      fn: fn,
    };

    if (!isFunction(fn)) {
      err(db, "/err/types/on/1", obj);
      return;
    }

    /*
  if (fn.length !== 1) {
    err(db, '/err/types/on/1', obj)
    return
  }
  */

    listenerId += 1;
    if (!db.updates.fns[path]) {
      db.updates.fns[path] = {};
      db.updates.fns[path][listenerId] = {
        fn,
        refinee,
      };
      db.updates.cache[path] = {};

      updateTriggers(db, path);
    } else {
      db.updates.fns[path][listenerId] = {
        fn,
        refinee,
      };
    }

    if (!db.updates.refinees[path]) {
      db.updates.refinees[path] = {
        [AccessMethods.value]: [],
        [AccessMethods.includes]: [],
        [AccessMethods.length]: [],
        [AccessMethods.isObserved]: [],
      };
    }

    db.updates.refinees[path][refinee.type].push(listenerId);

    if (isWildcardPath(path)) {
      triggerWildcardFn(db, path, listenerId);
    } else {
      triggerListenerFn(db, path, listenerId);
    }

    const triggerIsObserved = () => {
      const impactedPaths = pathTriggers(db, path);
      impactedPaths.forEach((impactedPath) => {
        if (
          !db.updates.refinees[impactedPath] ||
          !db.updates.refinees[impactedPath][AccessMethods.isObserved]
        ) {
          return;
        }

        let idx =
          db.updates.refinees[impactedPath][AccessMethods.isObserved].length;
        while (idx--) {
          let id =
            db.updates.refinees[impactedPath][AccessMethods.isObserved][idx];
          triggerListenerFn(
            db,
            impactedPath,
            id,
            isWildcardPath(impactedPath) ? [{ op: "test", path }] : []
          );
        }
      });
    };

    // special case of isObserved
    if (refinee.type !== AccessMethods.isObserved) {
      triggerIsObserved();
    }

    let id = listenerId;
    return function unsubscribe() {
      if (db.updates.fns[path]) {
        delete db.updates.fns[path][id];
      }

      // Remove everything related to this path as no
      // more listeners exist
      if (Object.keys(db.updates.fns[path]).length === 0) {
        db.updates.fns[path] = null;
        delete db.updates.fns[path];
        db.updates.cache[path] = null;
        delete db.updates.cache[path];

        let triggers = db.updates.triggers;
        let key;
        let keys = Object.keys(triggers);
        let l = keys.length;
        let i;
        let arr;

        while (l--) {
          key = keys[l];
          arr = triggers[key];
          i = arr.indexOf(path);

          if (i !== -1) {
            arr.splice(i, 1);
          }

          if (arr.length === 0) {
            triggers[key] = null;
            delete triggers[key];
          }
        }
      }

      // special case of isObserved
      if (refinee.type !== AccessMethods.isObserved) {
        triggerIsObserved();
      }
    };
  };

export default on;

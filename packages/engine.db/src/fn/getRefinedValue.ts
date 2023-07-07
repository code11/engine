import { AccessMethods } from "@c11/engine.types";
import isString from "lodash/isString";
import isArray from "lodash/isArray";
import isFunction from "lodash/isFunction";
import getNode from "./getNode";
import { isWildcardPath } from "./isWildcardPath";
import splitPath from "./splitPath";

const getValuePath = (db, path, patch) => {
  if (isWildcardPath(path)) {
    if (!patch || !patch[0] || !patch[0].path) {
      return;
    }
    const patchPath = patch[0].path;
    const pathParts = splitPath(path);
    const patchParts = splitPath(patchPath);
    const pathIdx = pathParts.indexOf("*");
    const sufix = pathParts.slice(pathIdx + 1);
    let resultPath;

    if (pathParts.length < patchParts.length) {
      resultPath = "/" + patchParts.slice(0, pathParts.length).join("/");
    } else if (pathParts.length > patchParts.length && sufix.length > 0) {
      resultPath = `${patchPath}/${sufix.join("/")}`;
    } else {
      resultPath = patch[0].path;
    }
    // console.log(path, patchPath, resultPath, patch);
    return getNode(db, resultPath, patch);
  } else {
    return getNode(db, path, patch);
  }
};

let ops = {
  [AccessMethods.value]: (db, path, patch, refinee) => {
    let val = getValuePath(db, path, patch);
    return val;
  },
  [AccessMethods.includes]: (db, path, patch, refinee) => {
    const val = getNode(db, path, patch);
    const searchFor = refinee.args && refinee.args[0];
    if (isArray(val) || isString(val)) {
      return val.includes(searchFor);
    }
  },
  [AccessMethods.length]: (db, path, patch, refinee) => {
    const val = getNode(db, path, patch);

    if (!(isString(val) || isArray(val) || isFunction(val))) {
      return;
    }

    return val.length;
  },
  [AccessMethods.isObserved]: (db, path, patch, refinee) => {
    let targetPath = isWildcardPath(path) && patch[0] ? patch[0].path : path;
    if (!db.updates.fns[targetPath]) {
      return false;
    }

    const listener = Object.values(db.updates.fns[targetPath]).find((x) => {
      //@ts-ignore
      return x.refinee.type !== AccessMethods.isObserved;
    });

    if (listener) {
      return true;
    } else {
      return false;
    }
  },
};

export function getRefinedValue(db, path, patch, refinee) {
  if (!refinee || !refinee.type || !ops[refinee.type]) {
    return;
  }
  const value = ops[refinee.type](db, path, patch, refinee);

  return value;
}

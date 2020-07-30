import splitPath from "./splitPath";
import clone from "../fn/clone";

function setCache(db, path, value, dynamicParent) {
  db.cache.paths[path] = clone(value);

  if (dynamicParent && db.cache.dynamic[dynamicParent].indexOf(path) === -1) {
    db.cache.dynamic[dynamicParent].push(path);
  }
}

export default setCache;

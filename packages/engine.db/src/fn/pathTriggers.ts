import flatten from "lodash/flattenDeep";
import uniq from "uniq";
import decomposePath from "./decomposePath";

const shouldUpdate = (source: string, path: string): boolean => {
  let result = false;

  if (
    path.substr(0, source.length) === source ||
    source.substr(0, path.length) === path
  ) {
    result = true;
  }

  return result;
};

const isNestedDynamic = (db: any, source: string, path: string): boolean => {
  return Object.keys(db.dynamic.fullDeps).some((x) => {
    if (path.substr(0, x.length) === x) {
      return db.dynamic.fullDeps[x].some((y) => {
        return source.substr(0, y.length) === y;
      });
    }
  });
};

const isValueInWildcard = (value: any = {}, parts: string[] = []): boolean => {
  let val = value;
  for (let i = 0; i < parts.length - 1; i += 1) {
    if (!val[parts[i]]) {
      return false;
    }
    val = val[parts[i]];
  }
  return true;
};

const isWildcardTrigger = (
  source: string,
  path: string,
  value: any
): boolean => {
  if (!path.includes("*")) {
    return false;
  }
  const sourceParts = source.split("/");
  sourceParts.shift();
  const pathParts = path.split("/");
  pathParts.shift();

  for (let i = 0; i < pathParts.length - 1; i += 1) {
    let part = pathParts[i];
    if (part === "*") {
      if (
        i === sourceParts.length - 1 &&
        pathParts.length > sourceParts.length
      ) {
        const result = isValueInWildcard(
          value,
          pathParts.splice(i + 1, pathParts.length - 1)
        );
        return result;
      } else {
        return true;
      }
    } else if (sourceParts[i] !== part) {
      return false;
    }
  }
  return true;
};

function pathTriggers(db: any, path: any, value: any = undefined) {
  let trigger: any[] = [];

  let parts = decomposePath(path);

  //@ts-ignore
  parts.push(path);

  parts.forEach((x) => {
    if (db.updates.triggers[x]) {
      db.updates.triggers[x].forEach((y) => {
        if (db.dynamic.staticDeps[path]) {
          const paths = db.dynamic.staticDeps[path];
          paths.forEach((z) => {
            if (shouldUpdate(y, z)) {
              trigger.push(y);
            }
          });
        } else if (shouldUpdate(path, y)) {
          trigger.push(y);
        } else if (isNestedDynamic(db, path, y)) {
          trigger.push(y);
        } else if (isWildcardTrigger(path, y, value)) {
          trigger.push(y);
        } else {
          // console.log("[excluding]", x, "for", y, "and", path);
        }
      });
    }
  });

  // @TODO: Suboptimal way, this should be precompiled
  let reg = new RegExp("^" + path, "g");

  Object.keys(db.updates.triggers).forEach((x) => {
    if (x.search(reg) !== -1) {
      db.updates.triggers[x].forEach((y) => {
        trigger.push(y);
      });
    }
  });

  let dep = db.dynamic.inverseDeps[path];

  if (dep) {
    trigger = trigger.concat(dep);
  }

  trigger = flatten(trigger);

  trigger.push(path);

  trigger = uniq(trigger);

  return trigger;
}

export default pathTriggers;

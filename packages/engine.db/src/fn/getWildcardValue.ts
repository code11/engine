import splitPath from "./splitPath";
import getValue from "./getValue";

export const getWildcardValue = (obj, path, patch) => {
  let parts = splitPath(path);
  let wildcardIdx = parts.indexOf("*");

  patch.forEach((x) => {
    let partsPatch = splitPath(x.path);

    if (wildcardIdx < partsPatch.length) {
      path = path.replace("*", partsPatch[wildcardIdx]);
    } else {
      // search in the value and see what changed
    }
  });

  if (!path.includes("*")) {
    return getValue(obj, path);
  }
};

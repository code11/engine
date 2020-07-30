import uniq from "uniq";

function decomposePath(path) {
  let xs: string[] = [];

  let x = path.slice(0, path.lastIndexOf("/"));
  while (x !== "") {
    //@ts-ignore
    xs.push(x);
    x = x.slice(0, x.lastIndexOf("/"));
  }

  let parts = path.split("/");
  let wildcards: string[] = [];
  while (parts.length > 2) {
    parts.pop();
    parts.push("*");
    wildcards.push(parts.join("/"));
    parts.pop();
  }

  let parts2 = path.split("/");
  while (parts2.length > 2) {
    let newParts = parts2.concat([]);
    for (let i = 2; i < newParts.length; i += 1) {
      newParts[i] = "*";
    }
    parts2.pop();
    wildcards.push(newParts.join("/"));
  }

  const result = uniq(xs.concat(wildcards));

  return result;
}

export default decomposePath;

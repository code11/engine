const { readFileSync } = require("fs");
const isEsVersion = require("is-es-version");

const fileIsEsVersion = (version, encoding) => (path) => {
  const scriptContent = readFileSync(path, encoding);
  return isEsVersion(scriptContent, version);
};

const fileIsES5 = (encoding) => fileIsEsVersion(5, encoding);

export = {
  fileIsEsVersion,
  fileIsES5,
};

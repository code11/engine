const { resolve } = require("path");
const { realpathSync } = require("fs");

// We are counting that commands will be ran from the app root directory
// Including the scripts directly to the template app npm scripts will ensure this
const currentAppDirectory = realpathSync(process.cwd());

const resolveRelativeToApp = (...segments) =>
  resolve(currentAppDirectory, ...segments);

const resolveRelativeToPackage = (...segments) =>
  resolve(__dirname, "../", "../", ...segments);
export = {
  currentAppDirectory,
  resolveRelativeToApp,
  root: resolve(__dirname, "../"),
  src: resolveRelativeToApp("src"),
  modules: resolveRelativeToApp("src", "modules"),
  distApp: resolveRelativeToApp(".dist.app"),
  distModule: resolveRelativeToApp(".dist.module"),
  distComponent: resolveRelativeToApp(".dist.component"),
  assets: resolveRelativeToApp(".dist.app", "assets"),
  nodeModules: resolveRelativeToApp("node_modules"),
  entrypoint: resolveRelativeToApp("src", "index.tsx"),
  htmlTemplate: resolveRelativeToApp("public", "index.html"),
  // htmlFavicon: resolveRelativeToApp("public", "assets", "favicon.png"),
  babelConfig: resolveRelativeToPackage("create-app-scripts","config", "babel.config.js"),
  packageJsonTemplate: resolveRelativeToPackage("create-app-scripts", "assets", "package.template.json"),
  appTemplate: resolveRelativeToPackage("node_modules", "@c11/templates.app", "template"),
  babelModuleRewriteReplacer: resolveRelativeToPackage("create-app-scripts", "utils", "replace-module-paths.js")
};

const { resolve } = require("path");
const { realpathSync } = require("fs");

// We are counting that commands will be ran from the app root directory
// Including the c11-scripts directly to the template app npm scripts will ensure this
const currentAppDirectory = realpathSync(process.cwd());

const resolveRelativeToApp = (...segments) =>
  resolve(currentAppDirectory, ...segments);

const resolveRelativeToPackage = (...segments) =>
  resolve(__dirname, "../", "../", ...segments);

module.exports = {
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
  htmlTemplate: resolveRelativeToApp("public", "index.ejs"),
  htmlFavicon: resolveRelativeToApp("public", "assets", "favicon.png"),
  babelConfig: resolveRelativeToPackage("src","config", "babel.config.js"),
  appLoader: resolveRelativeToPackage("src", "assets", "loader.js"),
  packageJsonTemplate: resolveRelativeToPackage("src", "assets", "package.template.json"),
  // appPackageJson: resolveRelativeToApp("package.json"),
  appTemplate: resolveRelativeToPackage("node_modules", "@c11/templates.app", "template"),
  babelModuleRewriteReplacer: resolveRelativeToPackage("src", "utils", "replace-module-paths.js")
};

const paths = require('../utils/paths');

module.exports = {
  comments: false,
  minified: true,
  presets: [
    "@babel/preset-typescript",
    "@babel/preset-env",
    "@babel/preset-react",
  ],
  plugins: [
    "macros",
    ["module-rewrite", { "replaceFunc": paths.babelModuleRewriteReplacer }],
    "@babel/plugin-proposal-class-properties",
  ],
};

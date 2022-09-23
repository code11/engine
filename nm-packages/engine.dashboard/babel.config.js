module.exports = {
  presets: ["@babel/preset-typescript", "@babel/preset-env"],
  plugins: [
    ["@c11/engine.babel-plugin-syntax", { viewLibrary: "@c11/engine.react" }],
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties",
  ],
};

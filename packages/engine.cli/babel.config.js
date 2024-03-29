module.exports = {
  presets: ["@babel/preset-typescript", "@babel/preset-env"],
  plugins: [
    "@c11/engine.babel-plugin-syntax",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties",
  ],
};

module.exports = {
  presets: [
    "@babel/preset-typescript",
    "@babel/preset-env",
    "@babel/preset-react",
  ],
  plugins: [
    "babel-plugin-react-require",
    [
      "@c11/engine.babel-plugin-syntax",
      {
        viewLibrary: "@c11/engine.react",
      },
    ],
    "@babel/plugin-proposal-class-properties",
  ],
};

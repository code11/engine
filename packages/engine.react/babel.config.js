module.exports = {
  "presets": [
    "@babel/preset-typescript",
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": [
    ["@c11/engine.babel-plugin-syntax", { "viewLibrary": "../src"}],
    "@babel/plugin-proposal-class-properties",
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ]
}


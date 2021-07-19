import pluginTester from "babel-plugin-tester";
import prettier from "prettier";
import plugin from "../src";

const config = require("./babelConfig.json");

pluginTester({
  plugin,
  babelOptions: { filename: __filename, ...config },
  formatResult: (result: any) => {
    const results = result.match(
      /import\s+\{\s*view\s+as\s+([a-zA-Z_]+)\s*\}\sfrom\s['"]@c11\/engine\.react['"];?/,
      "foo"
    );
    if (results && results[1]) {
      const id = results[1];
      result = result.replace(new RegExp(id, "g"), "viewRandomId");
    }
    return prettier.format(result, {
      parser: "babel",
    });
  },
  pluginName: "@c11/engine.babel-plugin-hmr",
  tests: {
    "should add module.hot.accept() to view": {
      code: `
        export const result: view = ({
          a1 = '123',
        }) => { }
      `,
      snapshot: true,
    },
    "should add module.hot.accept() to view only once": {
      code: `
        const result: view = ({
          a1 = '123',
        }) => { }
        const result2: view = ({
          a1 = '123',
        }) => { }
      `,
      snapshot: true,
    },
    "should add module.hot.accept() to producer": {
      code: `
        const result: producer = ({
          a1 = '123',
        }) => { }
      `,
      snapshot: true,
    },
    "should add module.hot.accept() to producer only once": {
      code: `
        const result: producer = ({
          a1 = '123',
        }) => { }
        const result2: producer = ({
          a1 = '123',
        }) => { }
      `,
      snapshot: true,
    },
  },
});

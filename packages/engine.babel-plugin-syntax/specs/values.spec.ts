import pluginTester from "babel-plugin-tester";
import prettier from "prettier";
import plugin from "../src";

const config = require("./babelConfig.json");

pluginTester({
  plugin,
  babelOptions: { filename: __filename, ...config },
  formatResult: (result: any) => {
    result = result.replace(
      /buildId:\s?\"[a-zA-Z_]+\"/g,
      `buildId:"unique_id"`
    );
    return prettier.format(result, {
      parser: "babel",
    });
  },
  pluginName: "engine.babel-plugin-syntax",
  tests: {
    "should keep constants": {
      code: `
        const SectionId = {}
        const result: producer = ({
          a1 = '123',
          a2 = {
            foo: 123
          },
          a3 = function () { return false },
          a4 = () => {},
          a5 = /123/,
          a6 = null,
          a7 = undefined,
          a8 = SectionId.foo,
        }) => { }
      `,
      snapshot: true,
    },
    "should support expressions": {
      code: `
        const result: producer = ({
          a1 = get.foo || '123' && '123',
        }) => {}
      `,
      snapshot: true,
    },
    "should support nesting": {
      code: `
        const result: producer = ({
          a1 = {
            val1: {
              bar: 123,
            },
            val2: get.foo
          }
        }) => {}
      `,
      snapshot: true,
    },
  },
});

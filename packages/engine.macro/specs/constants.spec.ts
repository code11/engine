import pluginTester from "babel-plugin-tester";
import prettier from "prettier";
import plugin from "babel-plugin-macros";

// const macroFile = "'./build/macro/index.macro'";
const macroFile = "'@c11/engine.macro'";
const config = require("./babelConfig.json");

pluginTester({
  plugin,
  babelOptions: { filename: __filename, ...config },
  formatResult: (result: any) => {
    return prettier.format(result, {
      parser: "babel",
    });
  },
  tests: {
    "should keep Constants": {
      only: true,
      code: `
        import { producer } from ${macroFile}
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
          a8 = SectionId.foo
        }) => { }
      `,
      snapshot: true,
    },
  },
});
